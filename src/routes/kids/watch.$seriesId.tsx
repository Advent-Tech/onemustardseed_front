import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Play, ArrowLeft, Lock, Mic2, Eye, Crown, ChevronDown } from "lucide-react";
import logoImg from "@/assets/logo2/image3.png";
import { mediaUrl, API_URL, getVimeoEmbedUrl } from "@/lib/api";


export const Route = createFileRoute("/kids/watch/$seriesId")({
  component: KidsWatchPage,
});

function KidsWatchPage() {
  const { seriesId } = Route.useParams();

  const [series, setSeries] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [accessType, setAccessType] = useState<string | null>(null);
  // tracks views: { episodeId -> viewCount }
  const [episodeViews, setEpisodeViews] = useState<Record<string, number>>({});
  // session dedup so re-selecting same episode doesn't re-count
  const viewedThisSession = useRef<Set<string>>(new Set());

  // Real backend access check
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) { setCheckingAccess(false); return; }

    // Quick local check
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.kidsAccess) { setHasAccess(true); setAccessType(user.kidsAccessType); }
      } catch { }
    }

    fetch(`${API_URL}/kids/access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setHasAccess(data.hasAccess || false);
        setAccessType(data.accessType || null);
      })
      .catch(() => { })
      .finally(() => setCheckingAccess(false));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

        // Step 1: Fetch series FIRST to get banner image for episode thumbnail fallback
        const seriesRes = await fetch(`${API_URL}/kids/series/${seriesId}`, { headers });
        if (!seriesRes.ok) return;
        const seriesData = await seriesRes.json();
        const seriesObj = {
          ...seriesData,
          id: seriesData._id,
          desc: seriesData.description,
          img: seriesData.image
        };
        setSeries(seriesObj);

        // Step 2: THEN fetch episodes, using series banner image as fallback thumbnail
        const epRes = await fetch(`${API_URL}/kids/series/${seriesId}/episodes`, { headers });
        if (epRes.ok) {
          const data = await epRes.json();
          const mappedEpisodes = data.map((ep: any) => ({
            ...ep,
            id: ep._id,
            img: ep.image || seriesData.image || "https://images.unsplash.com/photo-1502086223501-7ea2443054f1?w=800&h=400&fit=crop",
            link: ep.vimeoLink || ep.trailer || ""
          }));
          setEpisodes(mappedEpisodes);
          if (mappedEpisodes.length > 0) {
            setActiveEpisodeId(mappedEpisodes[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch watch data", err);
      }
    };

    if (seriesId) fetchAll();
  }, [seriesId]);

  // Track a view whenever the active episode changes
  useEffect(() => {
    if (!activeEpisodeId || viewedThisSession.current.has(activeEpisodeId)) return;
    viewedThisSession.current.add(activeEpisodeId);

    fetch(`${API_URL}/kids/episodes/${activeEpisodeId}/view`, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (typeof data.views === 'number') {
          setEpisodeViews(prev => ({ ...prev, [activeEpisodeId]: data.views }));
        }
      })
      .catch(() => {/* silent */ });
  }, [activeEpisodeId]);

  // Seed initial view counts from fetched episodes
  useEffect(() => {
    if (episodes.length === 0) return;
    const initial: Record<string, number> = {};
    episodes.forEach(ep => { initial[ep.id] = ep.views || 0; });
    setEpisodeViews(initial);
  }, [episodes]);

  const activeEpisode = episodes.find((e) => e.id === activeEpisodeId) || episodes[0] || null;
  const currentTitle = activeEpisode?.title || series?.name;
  const currentDesc = activeEpisode?.description || series?.desc;
  const currentLink = activeEpisode?.link || series?.trailer;
  const currentAudio = activeEpisode?.audioLink || series?.audioLink;
  const fallbackThumb = "https://images.unsplash.com/photo-1502086223501-7ea2443054f1?w=800&h=400&fit=crop";

  if (checkingAccess || !series) {
    return (
      <div className="theme-cinema min-h-screen flex flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1700px] flex-grow px-4 pb-16 pt-24 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="skeleton aspect-video rounded-2xl" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          </div>
          <p className="sr-only" role="status">{checkingAccess ? "Verifying access" : "Loading"}</p>
        </main>
      </div>
    );
  }

  // No access — blurred preview + plans
  if (!hasAccess) {
    return (
      <div className="theme-cinema min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow pt-24">
          <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <Link to="/kids/library" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-cream/60 transition hover:text-cream">
              <ArrowLeft className="h-4 w-4" /> Back to library
            </Link>
            <div className="relative mb-10 overflow-hidden rounded-2xl">
              <img src={mediaUrl(series.img || series.image) || fallbackThumb} alt="" className="aspect-video w-full object-cover opacity-40 blur-md" onError={(e) => { (e.target as HTMLImageElement).src = fallbackThumb; }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-6">
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur"><Lock className="h-7 w-7 text-gold" /></div>
                <h1 className="font-display text-3xl font-semibold text-cream">{series.name}</h1>
                <p className="mt-1 text-sm text-cream/60">{series.topic} series · {series.episodeCount || 0} episodes</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-cinema-raise p-8 sm:p-12">
              <Crown className="mx-auto mb-5 h-10 w-10 text-gold" />
              <h2 className="font-display text-3xl font-semibold text-cream">Unlock this series</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-cream/70">
                Subscribe to Kids Bible Flix to watch <strong className="text-cream">{series.name}</strong> and the full library of kid-safe Bible videos.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link to="/kids/subscribe" className="rounded-full bg-cream py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:scale-[1.02]">View plans</Link>
                <Link to="/kids/subscribe" className="rounded-full bg-gradient-gold py-4 text-sm font-bold uppercase tracking-widest text-gold-foreground transition hover:scale-[1.02]">Get lifetime — $99</Link>
              </div>
              <p className="mt-6 text-xs text-cream/50">
                Already subscribed?{" "}
                <Link to="/login" search={{ redirect: `/kids/watch/${seriesId}`, theme: "kids" }} className="font-bold text-gold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="theme-cinema min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow pt-20 sm:pt-24">
        <div className="mx-auto max-w-[1700px] px-4 pb-16 sm:px-6">
          <Link to="/kids/library" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cream/60 transition hover:text-cream">
            <ArrowLeft className="h-4 w-4" /> Library
          </Link>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px]">
            {/* Player + details */}
            <div>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
                {currentLink ? (
                  <iframe
                    key={activeEpisodeId}
                    src={getVimeoEmbedUrl(currentLink, { autoplay: 1, title: 0, byline: 0, portrait: 0 })}
                    title={currentTitle}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : currentAudio ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-cream">
                    <img src={mediaUrl(activeEpisode?.img || series.img || series.image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" onError={(e) => { (e.target as HTMLImageElement).src = fallbackThumb; }} />
                    <div className="relative z-10 flex w-full max-w-md flex-col items-center">
                      <Mic2 className="mb-5 h-16 w-16 text-gold" />
                      <h3 className="mb-6 text-center text-2xl font-bold">{currentTitle}</h3>
                      <audio controls src={currentAudio} className="w-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={mediaUrl(activeEpisode?.img || series.img || series.image)} alt="" className="h-full w-full object-cover opacity-40" onError={(e) => { (e.target as HTMLImageElement).src = fallbackThumb; }} />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="rounded-full bg-black/70 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-cream">Video coming soon</span>
                    </div>
                  </>
                )}
              </div>

              <h1 className="mt-4 font-display text-xl font-semibold leading-snug text-cream sm:text-2xl">
                {series.name}{series.name !== currentTitle ? `: ${currentTitle}` : ""}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <img src={logoImg} alt="" className="h-10 w-10 rounded-full bg-cream object-contain p-1" />
                <div className="mr-auto leading-tight">
                  <p className="text-sm font-semibold text-cream">Kids Bible Flix</p>
                  <p className="text-xs text-cream/55">{episodes.length} episodes</p>
                </div>
                {series.topic && <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-cream">{series.topic}</span>}
                {activeEpisode && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-cream">
                    <Eye className="h-3.5 w-3.5" /> {(episodeViews[activeEpisode.id] ?? activeEpisode.views ?? 0).toLocaleString()} views
                  </span>
                )}
              </div>

              {currentDesc && (
                <details className="group mt-4 rounded-xl bg-white/[0.06] p-4 text-sm leading-relaxed text-cream/85">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <span className="line-clamp-2 whitespace-pre-wrap group-open:line-clamp-none">{currentDesc}</span>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                </details>
              )}
            </div>

            {/* Up next */}
            <aside aria-label="Up next">
              <h2 className="mb-3 text-base font-semibold text-cream">Up next</h2>
              <ul className="space-y-2 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
                {episodes.map((ep) => {
                  const active = activeEpisodeId === ep.id;
                  return (
                    <li key={ep.id}>
                      <button
                        onClick={() => { setActiveEpisodeId(ep.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        aria-current={active ? "true" : undefined}
                        className={`group flex w-full gap-3 rounded-xl p-2 text-left transition ${active ? "bg-white/10" : "hover:bg-white/[0.06]"}`}
                      >
                        <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:w-44">
                          <img src={mediaUrl(ep.img)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = series?.img || series?.image || fallbackThumb; }} />
                          {active && (
                            <div className="absolute inset-0 grid place-items-center bg-black/55">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-cream">Now playing</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 py-0.5">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-cream">{ep.title}</h3>
                          <p className="mt-1 text-xs text-cream/55">Kids Bible Flix</p>
                          <p className="text-xs text-cream/55">{(episodeViews[ep.id] ?? ep.views ?? 0).toLocaleString()} views</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {episodes.length === 0 && <li className="py-8 text-center text-sm text-cream/50">No episodes available yet.</li>}
              </ul>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
