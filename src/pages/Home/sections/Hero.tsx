import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { API_URL, mediaUrl } from "../../../lib/api";
import { HERO_CONTENT } from "../../../data/home-data";
import heroImg from "@/assets/oms/hero-cover.webp";

type LiveEvent = { id: string; name: string; location?: string };

export function Hero() {
  const [adminMedia, setAdminMedia] = useState<string | null>(null);
  const [live, setLive] = useState<LiveEvent | null>(null);
  const bg = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/settings`).then((r) => r.json()).then((d) => {
      if (d?.success && d.data?.home_hero_media) setAdminMedia(d.data.home_hero_media);
    }).catch(() => {});
    fetch(`${API_URL}/events`).then((r) => r.json()).then((d) => {
      if (!d?.success) return;
      const next = (d.data as any[]).find((e) => e.status === "Active");
      if (next) setLive({ id: next._id, name: next.name, location: next.location });
    }).catch(() => {});
  }, []);

  // Gentle parallax: the photo drifts slower than the page.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, window.innerHeight);
        if (bg.current) bg.current.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1.08 + y * 0.00012})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const src = adminMedia ? mediaUrl(adminMedia) : heroImg;
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
  const words = HERO_CONTENT.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  const lastWord = lines[1].split(" ").pop()!;
  const lead = lines[1].slice(0, lines[1].length - lastWord.length);

  return (
    <section className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden pb-14 pt-32 sm:pb-20">
      <div ref={bg} className="absolute inset-0 -z-20 will-change-transform">
        {isVideo ? (
          <video src={src} autoPlay loop muted playsInline className="h-full w-full object-cover" />
        ) : (
          <img src={src} alt="A family watching the sun rise over a mountain lake" width={1672} height={941} fetchPriority="high" className="h-full w-full object-cover" />
        )}
      </div>
      {/* Light falls from the sun side; the page colour rises from below */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,oklch(0.18_0.04_155/0.88)_0%,oklch(0.18_0.04_155/0.45)_45%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-transparent" />

      <div className="mx-auto grid w-full max-w-[1320px] items-end gap-10 px-6 sm:px-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span className="eyebrow animate-fade-up">{HERO_CONTENT.subtitle}</span>

          <h1 className="mt-6 font-display font-light leading-[0.9] tracking-[-0.03em] text-cream text-[clamp(2.9rem,8.4vw,8.6rem)]">
            <span className="block animate-fade-up whitespace-nowrap [animation-delay:120ms]">{lines[0]}</span>
            <span className="block animate-fade-up whitespace-nowrap [animation-delay:260ms]">
              {lead}
              <span className="italic text-gold">{lastWord}</span>
              <span className="text-gold">.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl animate-fade-up text-lg font-light leading-relaxed text-cream/85 [animation-delay:420ms] sm:text-2xl">
            {HERO_CONTENT.description}
          </p>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:560ms]">
            <Link to={HERO_CONTENT.primaryCTA.href} className="cta cta-gold">
              <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
              {HERO_CONTENT.primaryCTA.label}
              <span className="cta-dot"><ArrowRight className="h-5 w-5" /></span>
            </Link>
            <a href={HERO_CONTENT.secondaryCTA.href} className="cta cta-ghost">
              {HERO_CONTENT.secondaryCTA.label}
              <span className="cta-dot"><ArrowUpRight className="h-5 w-5" /></span>
            </a>
          </div>
        </div>

        {/* Right column: live show card + rotating seal */}
        <div className="hidden flex-col items-end gap-8 lg:flex">
          {live && (
            <Link to="/events" className="glass spotlight group w-80 animate-fade-up rounded-3xl p-5 transition hover:-translate-y-1 [animation-delay:700ms]">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cream">
                <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden /> Now on tour
              </span>
              <p className="mt-3 font-display text-2xl leading-tight text-cream">{live.name}</p>
              {live.location && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-cream/70"><MapPin className="h-3.5 w-3.5 text-gold" /> {live.location}</p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold transition group-hover:gap-3">
                Get tickets <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )}

          <a href="#projects" aria-label="Scroll to projects" className="relative grid h-36 w-36 place-items-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow" aria-hidden>
              <defs><path id="seal" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text className="fill-cream" style={{ fontSize: 9.5, letterSpacing: "3.05px", textTransform: "uppercase", fontWeight: 700 }}>
                <textPath href="#seal">Explore · Watch · Listen · Gather ·</textPath>
              </text>
            </svg>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-forest-night"><ArrowRight className="h-6 w-6 rotate-90" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
