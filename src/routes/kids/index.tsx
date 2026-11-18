import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ChipBar, VideoCard, VideoGridSkeleton, VIDEO_GRID } from "@/components/oms/cinema";
import { Reveal } from "@/components/oms/Reveal";
import logoImg from "@/assets/logo2/image3.png";
import { mediaUrl, API_URL } from "@/lib/api";

export const Route = createFileRoute("/kids/")({
  head: () => ({
    meta: [
      { title: "Kids Bible Flix — Bible videos made for kids" },
      { name: "description", content: "Bible stories, songs, and faith-filled videos made just for kids. Ad-free and kid-safe." },
    ],
  }),
  component: KidsLandingPage,
});

const TOPICS = ["Kindness", "Courage", "Creation", "Worship", "Honesty", "Joy", "Peace", "Faith"];
const FALLBACK_BANNER = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2000";

function KidsLandingPage() {
  const [seriesList, setSeriesList] = useState<any[] | null>(null);
  const [banner, setBanner] = useState(FALLBACK_BANNER);
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/kids/series`);
        const d = await r.json();
        setSeriesList(Array.isArray(d) ? d.filter((s: any) => s.status === "Active") : []);
      } catch {
        setSeriesList([]);
      }
      try {
        const r = await fetch(`${API_URL}/kids/settings`);
        const d = await r.json();
        if (d?.value) setBanner(d.value);
      } catch {}
    })();
  }, []);

  const chips = useMemo(() => {
    const fromData = (seriesList ?? []).map((s) => s.topic).filter(Boolean);
    return ["All", ...Array.from(new Set([...TOPICS, ...fromData]))];
  }, [seriesList]);

  const visible = (seriesList ?? []).filter((s) => topic === "All" || s.topic === topic);

  const FAQS = [
    {
      q: "What age group is Kids Bible Flix designed for?",
      a: "Our content is curated for children aged 2 to 11. We offer preschool content that focuses on simple virtues and music, and more narrative-driven content for older kids to explore biblical history and character building."
    },
    {
      q: "Is the content biblically sound?",
      a: "Absolutely. All our scripts, stories, and educational materials are reviewed by theologians, children's ministry directors, and parents before production. Our mission is to stick close to Scripture while making it engaging for children."
    },
    {
      q: "Are there tools for parents and teachers?",
      a: "Yes! Every single video on our platform has a downloadable 'Connection Guide' containing discussion prompts, a memory verse card, and a family activity sheet. Teachers and homeschoolers love these for classroom lessons."
    },
    {
      q: "How does the subscription work?",
      a: "You start with a 7-day free trial. If you decide to stay, it is just $4.99/month. You can cancel at any time with a single click from your profile settings. There are no commitments and no hidden fees."
    },
    {
      q: "Can I watch offline on mobile devices?",
      a: "Yes! With our mobile app, parents can download videos and audio tracks directly to their device. This is perfect for road trips, flights, or anywhere without a reliable internet connection."
    }
  ];

  return (
    <div className="theme-cinema flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-20 sm:pt-24">
        {/* Channel header */}
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6">
          <div className="relative aspect-[16/7] overflow-hidden rounded-2xl bg-white/5 sm:aspect-[16/5]">
            <img src={mediaUrl(banner)} alt="" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BANNER; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <img src={logoImg} alt="Kids Bible Flix logo" className="h-20 w-20 rounded-full bg-cream object-contain p-2 sm:h-28 sm:w-28" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold text-cream sm:text-4xl">Kids Bible Flix</h1>
              <p className="mt-1 text-sm text-cream/60">
                {seriesList ? `${seriesList.length} series` : "Loading…"} · Ad-free · Kid-safe
              </p>
              <p className="mt-2 max-w-2xl text-sm text-cream/80">Bible stories, songs, and faith-filled videos made just for kids.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/kids/subscribe" className="btn-sheen rounded-full bg-cream px-6 py-3 text-sm font-bold text-black transition hover:scale-105 active:scale-95">Subscribe</Link>
              <Link to="/kids/library" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-white/20">Browse library</Link>
            </div>
          </div>

          <nav aria-label="Kids Bible Flix sections" className="mt-4 flex gap-2 border-b border-white/10 text-sm font-semibold text-cream/60">
            <span className="border-b-2 border-cream px-3 py-3 text-cream">Home</span>
            <Link to="/kids/library" className="px-3 py-3 transition hover:text-cream">Library</Link>
            <Link to="/kids/topics" className="px-3 py-3 transition hover:text-cream">Topics</Link>
            <Link to="/kids/series" className="px-3 py-3 transition hover:text-cream">Series</Link>
          </nav>

          <ChipBar chips={chips} active={topic} onChange={setTopic} label="Filter by topic" />

          <section className="py-8" aria-live="polite">
            {seriesList === null ? (
              <VideoGridSkeleton />
            ) : visible.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-cream/60">
                {topic === "All" ? "New videos are coming soon." : `No ${topic} videos yet — try another topic.`}
              </p>
            ) : (
              <div className={VIDEO_GRID}>
                {visible.map((s, i) => (
                  <VideoCard
                    key={s._id || s.id}
                    index={i}
                    to="/kids/watch/$seriesId"
                    params={{ seriesId: (s._id || s.id).toString() }}
                    image={mediaUrl(s.image) || FALLBACK_BANNER}
                    title={s.name}
                    avatar={logoImg}
                    channel="Kids Bible Flix"
                    meta={[s.topic, s.episodeCount ? `${s.episodeCount} episodes` : ""].filter(Boolean).join(" · ")}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Beyond the screen */}
        <section className="border-t border-white/10 py-16">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold"><BookOpen className="h-4 w-4" /> Beyond the screen</span>
              <h2 className="mt-3 font-display text-4xl font-light text-cream">Printable guides & <span className="italic text-gold">family activities</span></h2>
              <p className="mt-4 leading-relaxed text-cream/70">Every episode comes with teacher-vetted worksheets, memory verse coloring pages, and hands-on family connection prompts.</p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="grid gap-5 sm:grid-cols-2">
                {[
                  ["Discussion Cards", "Open-ended questions for dinner-table chat or class lessons."],
                  ["Crafts & Coloring", "Age-appropriate activity pages reinforcing the scripture focus."],
                  ["Memory Verses", "Printable cards for memorizing verses in fun ways."],
                  ["Sunday School Kits", "Simple guides for churches or homeschool groups."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div><h3 className="text-sm font-bold text-cream">{t}</h3><p className="mt-1 text-xs leading-relaxed text-cream/60">{d}</p></div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/10 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-medium text-cream">Questions parents ask</h2>
            <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-cinema-raise">
              {FAQS.map((f) => (
                <details key={f.q} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-cream [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-cream/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <Reveal from="scale" className="mx-auto max-w-[1200px]">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-forest-deep to-black p-10 text-center sm:p-16">
              <ShieldCheck className="mx-auto h-9 w-9 text-gold" />
              <h2 className="mt-4 font-display text-4xl font-light text-cream sm:text-5xl">Start your <span className="italic text-gold">7-day free trial</span></h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/70">Ad-free, kid-safe Bible videos for the whole family. Cancel any time.</p>
              <Link to="/kids/subscribe" className="btn-sheen mt-8 inline-block rounded-full bg-gradient-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-gold-foreground shadow-glow transition hover:scale-105 active:scale-95">Subscribe now</Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
