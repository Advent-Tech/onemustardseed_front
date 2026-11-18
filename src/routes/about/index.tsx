import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Heart, ShieldCheck, Award, Sprout } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, SectionHeading } from "@/components/oms/PageHero";
import { Reveal } from "@/components/oms/Reveal";
import { useEffect, useRef, useState } from "react";
import connectingHearts from "@/assets/oms/about-connecting-hearts.webp";

export const Route = createFileRoute("/about/")({
  head: () => ({
    meta: [
      { title: "About Us — One Mustard Seed" },
      {
        name: "description",
        content:
          "The story of One Mustard Seed — from a ministry founded in Berrien Springs, Michigan in 2006 to films, live events, podcasts and resources that help kids know God.",
      },
    ],
  }),
  component: AboutPage,
});

/**
 * Photo that sits next to “Let’s sow more seeds of wonder”.
 * The client is supplying this image — drop it in src/assets/oms/ and point this at it, e.g.
 *   import sowSeeds from "@/assets/oms/about-sow-seeds.webp";  const SOW_SEEDS_PHOTO = sowSeeds;
 */
const SOW_SEEDS_PHOTO: string | null = null;

const VALUES = [
  {
    Icon: Compass,
    title: "Scripture & Wonder",
    desc: "We believe discovering the Creator through His creation should be filled with awe, curiosity, and deep biblical truth.",
  },
  {
    Icon: Heart,
    title: "Family Centered",
    desc: "Creating content and experiences that bring families, classrooms, and churches closer together in shared faith.",
  },
  {
    Icon: ShieldCheck,
    title: "Pure Integrity",
    desc: "100% kid-safe and parent-approved. Free from harmful ads, data trackers, or agenda-driven content.",
  },
  {
    Icon: Award,
    title: "Cinematic Excellence",
    desc: "Faith-centered media deserves the highest standards of visual, musical, and narrative craft.",
  },
];

/** Timeline copy supplied by the client (About Us Page doc). */
const TIMELINE = [
  { year: "2006", title: "One Mustard Seed Founded", body: "One Mustard Seed is founded in Berrien Springs, Michigan, beginning a ministry dedicated to creating faith-building experiences and resources for children and families." },
  { year: "2008", title: "Full-Time Ministry Begins", body: "One Mustard Seed transitions into full-time ministry, opening the door for expanded speaking, media production, and outreach." },
  { year: "2012", title: "The Creation Case Produced", body: "One Mustard Seed produces The Creation Case, an original 13-episode television series exploring creation, science, nature, and evidence for a Creator." },
  { year: "2016", title: "Live Touring Begins", body: "One Mustard Seed begins touring Dinosaur Encounter, marking the start of a growing live-event ministry reaching families across the country." },
  { year: "2017", title: "First Feature Film Released", body: "The Mysterious Note becomes One Mustard Seed’s first feature film and begins a new chapter of family-focused filmmaking." },
  { year: "2020", title: "Ministry Expands During COVID", body: "During the COVID-19 pandemic, One Mustard Seed produces weekly Kids Bible Zone episodes for children unable to attend church and also expands into publishing." },
  { year: "2023", title: "God’s Great Earth Launches", body: "One Mustard Seed launches God’s Great Earth, producing a full 52-episode season and expanding its ministry into weekly podcast and audio programming." },
  { year: "2024", title: "Film & Live Ministry Expand", body: "One Mustard Seed releases its second feature film, The Secret of the Fossil, and launches The Creation Case LIVE, a new multimedia touring production." },
  { year: "2026", title: "A New Chapter Begins", body: "One Mustard Seed officially becomes a nonprofit ministry and launches a new generation of fully staged multimedia touring experiences.", current: true },
];


/**
 * Signature element: the timeline is a stem that grows as you scroll, 2006 → 2026,
 * and the tip turns into a sprout — the mustard seed growing. Position is read once per frame.
 */
function useGrowth() {
  const ref = useRef<HTMLOListElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.6; // the stem grows where the reader is looking
      setP(Math.min(1, Math.max(0, (start - r.top) / r.height)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

function AboutPage() {
  const [stemRef, growth] = useGrowth();
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <main>
        <PageHero
          align="left"
          eyebrow="Our History"
          ghost="2006"
          title="Growing a"
          accent="generation"
          subtitle="Discover the story, the heart, and the global vision of One Mustard Seed Ministries."
        />

        {/* Narrative */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal from="left" className="space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold">The Dream</span>
              <h2 className="font-display text-4xl font-light leading-tight text-cream text-balance sm:text-5xl">
                Faith as small as a <span className="italic text-gold">mustard seed</span> can move mountains.
              </h2>
              <p className="text-lg font-light leading-relaxed text-cream/80">
                One Mustard Seed (OMS) began with a simple but radical premise: that faith, science, and beautiful art do not have to be strangers. In a world of hurried feeds and screen-driven noise, we wanted to build a sanctuary of media that inspires children and adults to look up, wonder, and belong.
              </p>
              <p className="text-lg font-light leading-relaxed text-cream/80">
                As a multimedia ministry, we construct films, podcasts, books, and curriculum designed to nourish deep roots. We partner with parents, pastors, and educators in over 100 countries to plant seeds of trust and curiosity that grow into trees of lifelong conviction.
              </p>
            </Reveal>

            <Reveal from="right" delay={120}>
              <figure className="arch relative mx-auto max-w-lg overflow-hidden shadow-elevated ring-1 ring-gold/30">
                <img
                  src={connectingHearts}
                  alt="Four generations of the Aguilera family together"
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="aspect-[4/5] h-full w-full object-cover transition duration-[1400ms] hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-night/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-7 left-7 text-cream">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gold">Our Heartbeat</p>
                  <span className="font-display text-2xl">Connecting Hearts Across Generations</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="relative bg-forest-night/60 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeading eyebrow="Our Timeline" title="The journey" accent="of the seed" className="[&_h2]:mt-3" />
              <Reveal delay={120}>
                <p className="mt-4 text-cream/70">Twenty years of planting seeds — and watching them grow.</p>
              </Reveal>
            </div>

            <ol ref={stemRef} className="relative mt-20">
              {/* track + growing stem */}
              <div className="absolute bottom-2 left-[19px] top-2 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" aria-hidden />
              <div
                className="absolute left-[19px] top-2 w-0.5 origin-top bg-gradient-to-b from-gold/40 to-gold md:left-1/2 md:-translate-x-1/2"
                style={{ height: `calc((100% - 1rem) * ${growth})` }}
                aria-hidden
              />
              <div
                className="absolute left-[19px] z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
                style={{ top: `calc(0.5rem + (100% - 1rem) * ${growth})` }}
                aria-hidden
              >
                <Sprout className="h-7 w-7 rounded-full bg-forest-night p-1 text-gold drop-shadow-[0_0_12px_oklch(0.8_0.13_85/0.7)]" strokeWidth={1.6} />
              </div>

              {TIMELINE.map((t, i) => {
                const right = i % 2 === 1;
                return (
                  <li key={t.year} className="relative mb-12 last:mb-0 md:mb-16">
                    <div className="grid gap-4 pl-14 md:grid-cols-2 md:gap-24 md:pl-0">
                      <span
                        className={`absolute left-[19px] top-2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full transition-all duration-500 md:left-1/2 ${
                          growth >= (i + 0.35) / TIMELINE.length ? "scale-110 bg-gold shadow-glow" : "bg-forest-deep ring-2 ring-white/25"
                        }`}
                        aria-hidden
                      />

                      <Reveal
                        from={right ? "right" : "left"}
                        className={`${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
                      >
                        <div className={`font-display text-5xl font-light italic ${t.current ? "text-gold" : "text-gold/85"} sm:text-6xl`}>{t.year}</div>
                        <h3 className="mt-2 font-display text-2xl text-cream">{t.title}</h3>
                        <p className="mt-3 leading-relaxed text-cream/75 text-pretty">{t.body}</p>
                      </Reveal>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading eyebrow="What Guides Us" title="Our core" accent="values" className="[&_h2]:mt-3" />
            <Reveal delay={120}>
              <p className="mt-4 text-cream/70">The pillars that keep our roots firm and our branches growing true.</p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="h-full rounded-[2rem] border border-white/10 bg-forest-raise p-8 transition duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-elevated">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-cream">{title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-cream/75">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Call to action with photo slot */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-28">
          <Reveal from="scale" className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-night shadow-elevated ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,oklch(0.8_0.13_85/0.18),transparent_55%)]" />
              <div className="relative grid items-stretch lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-7 p-10 sm:p-16">
                  <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gold">
                    Be a part of the story
                  </span>
                  <h2 className="font-display text-4xl font-light leading-tight text-cream sm:text-6xl">
                    Let’s sow more
                    <br />
                    <span className="italic text-gold">seeds of wonder.</span>
                  </h2>
                  <p className="text-lg font-light leading-relaxed text-cream/80">
                    Whether you’re a parent watching with your children, a teacher using our curricula, or a donor standing with our mission, we thank you. Together, we are building a shelter of faith.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/support" className="btn-sheen rounded-full bg-gradient-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-gold-foreground shadow-glow transition hover:scale-105 active:scale-95">
                      Support Our Mission
                    </Link>
                    <Link to="/contact" className="rounded-full border border-cream/30 px-8 py-4 text-sm font-bold uppercase tracking-widest text-cream transition hover:scale-105 hover:border-gold hover:text-gold">
                      Get In Touch
                    </Link>
                  </div>
                </div>

                <div className="relative min-h-[320px] lg:min-h-full">
                  {SOW_SEEDS_PHOTO ? (
                    <img src={SOW_SEEDS_PHOTO} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_60%,oklch(0.4_0.07_150),oklch(0.22_0.04_155))]">
                      <Sprout className="h-24 w-24 text-gold/70" strokeWidth={1.2} aria-hidden />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-night via-forest-night/10 to-transparent max-lg:bg-gradient-to-t" />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
