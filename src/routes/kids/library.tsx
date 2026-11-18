import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Search, Lock, Crown, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ChipBar, VideoCard, VideoGridSkeleton, VIDEO_GRID } from "@/components/oms/cinema";
import logoImg from "@/assets/logo2/image3.png";
import { mediaUrl, API_URL } from "@/lib/api";


export const Route = createFileRoute("/kids/library")({
  component: KidsLibraryPage,
});

const TOPICS = ["All", "Kindness", "Courage", "Creation", "Worship", "Honesty", "Joy", "Peace", "Faith"];

function KidsLibraryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeTopic, setActiveTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessType, setAccessType] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const navigate = useNavigate();

  // Real access check against backend
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const userData = localStorage.getItem("user_data");

    if (!token) {
      setCheckingAccess(false);
      return;
    }

    // Quick local check first
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.kidsAccess) {
          setHasAccess(true);
          setAccessType(user.kidsAccessType);
        }
      } catch { }
    }

    // Then verify with backend
    fetch(`${API_URL}/kids/access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setHasAccess(data.hasAccess || false);
        setAccessType(data.accessType || null);
        // Sync local user data
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const updated = { ...user, kidsAccess: data.hasAccess, kidsAccessType: data.accessType };
            localStorage.setItem("user_data", JSON.stringify(updated));
          } catch { }
        }
      })
      .catch(() => { })
      .finally(() => setCheckingAccess(false));
  }, []);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch(`${API_URL}/kids/series`);
        if (res.ok) {
          const data = await res.json();
          setSeriesList(Array.isArray(data) ? data.filter((s: any) => s.status === 'Active') : []);
        }
      } catch (err) {
        console.error("Failed to fetch series", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeries();
  }, []);

  const filteredContent = seriesList.filter((s) => {
    // Tab filter
    const type = s.contentType || "Creation Case";
    if (activeTab !== "All" && type !== activeTab) return false;

    // Topic filter
    if (activeTopic !== "All" && s.topic !== activeTopic) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(s.name || "").toLowerCase().includes(q) && !(s.description || "").toLowerCase().includes(q) && !(s.topic || "").toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  const cardImage = (s: any) => mediaUrl(s.image || s.img) || "https://images.unsplash.com/photo-1502086223501-7ea2443054f1?w=800&h=450&fit=crop";

  if (checkingAccess) {
    return (
      <div className="theme-cinema flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1700px] flex-grow px-4 pt-28 sm:px-6"><VideoGridSkeleton count={8} /></main>
      </div>
    );
  }

  // No access — paywall with a locked preview
  if (!hasAccess) {
    return (
      <div className="theme-cinema flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-grow pt-24">
          <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
            <div className="rounded-3xl border border-white/10 bg-cinema-raise p-8 text-center sm:p-12">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gold/10"><Lock className="h-8 w-8 text-gold" /></div>
              <h1 className="font-display text-4xl font-semibold text-cream">Unlock full access</h1>
              <p className="mt-4 leading-relaxed text-cream/70">
                Unlimited access to all series, audio stories, Creation Case episodes, and OMS kids resources. Start your <strong className="text-cream">7-day free trial</strong> or get lifetime access for <strong className="text-cream">$99</strong>.
              </p>
              <ul className="mt-7 grid gap-3 text-left sm:grid-cols-2">
                {["100% ad-free content", "All series & audio stories", "Creation Case episodes", "Downloadable guides", "New content added regularly", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-cream"><Check className="h-4 w-4 shrink-0 text-gold" />{f}</li>
                ))}
              </ul>
              <Link to="/kids/subscribe" className="btn-sheen mt-8 block w-full rounded-full bg-cream py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:scale-[1.02]">View plans & subscribe →</Link>
              <p className="mt-4 text-xs text-cream/50">
                Already subscribed?{" "}
                <Link to="/login" search={{ redirect: "/kids/library", theme: "kids" }} className="font-bold text-gold hover:underline">Sign in</Link>
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-[1700px] px-4 pb-20 sm:px-6">
            <h2 className="mb-6 text-lg font-semibold text-cream">Preview what’s inside</h2>
            <div className={VIDEO_GRID}>
              {seriesList.slice(0, 8).map((s, i) => (
                <VideoCard
                  key={s._id || s.id}
                  index={i}
                  to="/kids/subscribe"
                  image={cardImage(s)}
                  title={s.name || s.title}
                  avatar={logoImg}
                  channel="Kids Bible Flix"
                  meta={s.topic}
                  locked={<div className="absolute inset-0 grid place-items-center bg-black/55 backdrop-blur-[2px]"><Lock className="h-7 w-7 text-cream/90" /></div>}
                />
              ))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="theme-cinema flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-20 sm:pt-24">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <img src={logoImg} alt="" className="h-14 w-14 rounded-full bg-cream object-contain p-1.5" />
            <div className="mr-auto">
              <h1 className="font-display text-3xl font-semibold text-cream">Library</h1>
              <p className="flex items-center gap-1.5 text-sm text-cream/60"><Crown className="h-3.5 w-3.5 text-gold" />{accessType || "Premium"} member</p>
            </div>
            <label className="relative w-full sm:w-96">
              <span className="sr-only">Search the library</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, series, or topics"
                className="h-11 w-full rounded-full border border-white/15 bg-white/[0.06] pl-11 pr-10 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream"><X className="h-4 w-4" /></button>
              )}
            </label>
          </div>

          <ChipBar chips={TOPICS} active={activeTopic} onChange={setActiveTopic} label="Filter by topic" />

          <section className="py-8" aria-live="polite">
            {isLoading ? (
              <VideoGridSkeleton />
            ) : filteredContent.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-cream/60">Nothing matches that yet. Try another topic or search.</p>
            ) : (
              <div className={VIDEO_GRID}>
                {filteredContent.map((s, i) => (
                  <VideoCard
                    key={s._id || s.id}
                    index={i}
                    to="/kids/watch/$seriesId"
                    params={{ seriesId: (s._id || s.id).toString() }}
                    image={cardImage(s)}
                    title={s.name || s.title}
                    avatar={logoImg}
                    channel="Kids Bible Flix"
                    meta={[s.topic || "Series", s.episodeCount ? `${s.episodeCount} episodes` : ""].filter(Boolean).join(" · ")}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
