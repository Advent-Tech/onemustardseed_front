import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, MapPin, Ticket, CalendarX2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/oms/Reveal";
import { SectionHeading } from "@/components/oms/PageHero";
import { GivingBanner } from "@/components/oms/GivingBanner";
import { Ticker } from "@/components/oms/Ticker";
import { API_URL, mediaUrl } from "../lib/api";

import dinoLogo from "@/assets/oms/logo-dinosaur-encounter.webp";
import creationLogo from "@/assets/oms/logo-creation-case-live.webp";
import actionCroc from "@/assets/oms/events-action-croc.webp";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Live Events — One Mustard Seed" },
      {
        name: "description",
        content:
          "Immersive, multimedia live experiences for the whole family — Dinosaur Encounter and The Creation Case LIVE. Find a show near you and buy tickets.",
      },
    ],
  }),
  component: EventsPage,
});

type OmsEvent = {
  _id: string;
  name: string;
  location?: string;
  date?: string;
  dateLabel?: string;
  image?: string;
  ticketUrl?: string;
  status?: "Active" | "Draft" | "Past" | "Sold Out";
};

function formatDates(e: OmsEvent) {
  if (e.dateLabel) return e.dateLabel;
  if (!e.date) return "Dates coming soon";
  const d = new Date(e.date);
  return isNaN(d.getTime())
    ? e.date
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Show artwork falls back to the matching logo when an event has no uploaded image. */
function eventArt(e: OmsEvent) {
  if (e.image && e.image !== "no-photo.jpg") return { src: mediaUrl(e.image), isLogo: false };
  const n = e.name.toLowerCase();
  if (n.includes("creation")) return { src: creationLogo, isLogo: true };
  return { src: dinoLogo, isLogo: true };
}

/* ───────────────────────────── Hero ───────────────────────────── */

function EventsHero() {
  const video = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Respect reduced-motion: show the poster frame instead of autoplaying.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-black">
      <video
        ref={video}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/media/events-hero.mp4"
        poster="/media/events-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/25 to-black/55" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_80%,rgba(0,0,0,0.55),transparent_65%)]" />

      <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-40 sm:pb-28">
        <span className="glass animate-fade-up inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.28em] text-cream">
          <span className="live-dot h-2 w-2 rounded-full bg-live" aria-hidden />
          Live Events
        </span>

        <h1 className="animate-fade-up mt-7 font-display font-light leading-[0.86] tracking-[-0.035em] text-cream [animation-delay:150ms] text-[clamp(4.2rem,14vw,13rem)]">
          Live<br /><span className="italic text-gold">Events</span><span className="text-gold">.</span>
        </h1>

        <p className="animate-fade-up mt-8 max-w-2xl text-lg font-light leading-relaxed text-cream/90 [animation-delay:300ms] sm:text-xl">
          One Mustard Seed creates immersive, multimedia experiences designed to engage the whole family. Through
          powerful visuals, storytelling, music, and live production, our events explore faith, creation, science, and
          the Bible in ways that are exciting, memorable, and easy to connect with.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:450ms]">
          <a href="#tickets" className="cta cta-gold">
            Get tickets <span className="cta-dot"><Ticket className="h-5 w-5" /></span>
          </a>
          <a href="#shows" className="cta cta-ghost">
            Meet the shows <span className="cta-dot"><ArrowRight className="h-5 w-5" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Ticket bubbles (admin-managed) ───────────────────── */

function EventBubble({ event, index }: { event: OmsEvent; index: number }) {
  const art = eventArt(event);
  const soldOut = event.status === "Sold Out";
  const canBuy = !!event.ticketUrl && !soldOut;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Reveal delay={index * 100} className="w-full">
      {/* A ticket: artwork above the tear line, details and the buy button on the stub below it */}
      <article
        onMouseMove={onMove}
        className="spotlight group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-forest-raise shadow-card ring-1 ring-white/10 transition duration-500 hover:-translate-y-2 hover:rotate-[-0.6deg] hover:shadow-elevated hover:ring-gold/40"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-forest-night">
          {art.isLogo ? (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#35353a,#0d0d0f)] p-8">
              <img src={art.src} alt={event.name} className="h-full max-h-52 w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)] transition duration-700 group-hover:scale-110 group-hover:-rotate-2" />
            </div>
          ) : (
            <img src={art.src} alt={event.name} loading="lazy" className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-raise via-transparent to-transparent" />
          <span className="glass absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cream">
            {!soldOut && <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" aria-hidden />}
            {soldOut ? "Sold out" : "On sale now"}
          </span>
          <span className="absolute right-4 top-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-cream/70 [writing-mode:vertical-rl]">Admit one</span>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-1 sm:px-7">
          <h3 className="font-display text-3xl font-light leading-tight text-cream">{event.name}</h3>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="eyebrow !text-[0.7rem] !tracking-[0.22em] before:hidden"><MapPin className="h-3.5 w-3.5" aria-hidden /> City</dt>
              <dd className="mt-1.5 text-cream">{event.location || "To be announced"}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.7rem] !tracking-[0.22em] before:hidden"><Calendar className="h-3.5 w-3.5" aria-hidden /> Dates</dt>
              <dd className="mt-1.5 text-cream">{formatDates(event)}</dd>
            </div>
          </dl>
        </div>

        {/* Tear-off stub */}
        <div className="relative px-6 pb-6 pt-7 sm:px-7">
          <span className="perforation absolute inset-x-6 top-0" aria-hidden />
          <span className="absolute -left-3.5 -top-3.5 h-7 w-7 rounded-full bg-forest-deep ring-1 ring-white/10" aria-hidden />
          <span className="absolute -right-3.5 -top-3.5 h-7 w-7 rounded-full bg-forest-deep ring-1 ring-white/10" aria-hidden />
          {canBuy ? (
            <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="cta cta-gold w-full justify-between">
              Buy Tickets
              <span className="cta-dot"><Ticket className="h-5 w-5" /></span>
            </a>
          ) : (
            <span aria-disabled="true" className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-white/5 text-sm font-bold uppercase tracking-widest text-cream/40">
              {soldOut ? "Sold out" : "Tickets coming soon"}
            </span>
          )}
          <div aria-hidden className="mt-5 h-6 opacity-30 [background:repeating-linear-gradient(90deg,var(--cream)_0_2px,transparent_2px_5px,var(--cream)_5px_6px,transparent_6px_10px)]" />
        </div>
      </article>
    </Reveal>
  );
}

function TicketsSection() {
  const [events, setEvents] = useState<OmsEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((r) => r.json())
      .then((d) => {
        if (!d?.success) throw new Error("bad response");
        // Only live shows. Draft and Past are hidden — the Past section was removed on request.
        const list = (d.data as OmsEvent[]).filter((e) => e.status === "Active" || e.status === "Sold Out");
        setEvents(list);
      })
      .catch(() => {
        setFailed(true);
        setEvents([]);
      });
  }, []);

  return (
    <section id="tickets" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Tickets" title="Find a show" accent="near you" />
        <Reveal delay={100}>
          <p className="mt-4 max-w-2xl text-cream/70">
            Tickets are sold securely through Zeffy. Choose a show below to pick your seats.
          </p>
        </Reveal>

        <div className="mt-12 grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),380px))]">
          {events === null &&
            [0, 1].map((i) => <div key={i} className="skeleton aspect-[4/5] rounded-[2rem]" aria-hidden />)}

          {events?.map((e, i) => <EventBubble key={e._id} event={e} index={i} />)}
        </div>

        {events && events.length === 0 && (
          <Reveal className="mx-auto mt-4 max-w-xl rounded-[2rem] border border-dashed border-white/20 bg-white/[0.03] p-10 text-center">
            <CalendarX2 className="mx-auto h-8 w-8 text-gold" aria-hidden />
            <h3 className="mt-4 font-display text-2xl text-cream">
              {failed ? "We couldn’t load the schedule" : "New dates are on the way"}
            </h3>
            <p className="mt-2 text-cream/70">
              {failed
                ? "Please refresh the page, or contact us and we’ll help you find a show."
                : "Join the newsletter and we’ll tell you the moment tickets go on sale."}
            </p>
            <Link
              to={failed ? "/contact" : "/newsletter"}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-forest-night transition hover:scale-105"
            >
              {failed ? "Contact us" : "Join the newsletter"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── The two shows ───────────────────────── */

const SHOWS = [
  {
    id: "dinosaur-encounter",
    logo: dinoLogo,
    name: "Dinosaur Encounter",
    body: "Dinosaur Encounter is a live multimedia family experience that uses the fascination of dinosaurs to explore questions about fossils, origins, and the biblical account of creation. Through dramatic visuals, special effects, video, music, and storytelling, the show helps families look at dinosaurs through a faith-based lens while connecting biblical history with the evidence found in the natural world.",
  },
  {
    id: "creation-case-live",
    logo: creationLogo,
    name: "The Creation Case LIVE",
    body: "The Creation Case LIVE is a multimedia stage spin-off of the original The Creation Case television series. Using immersive video, large-screen visuals, music, storytelling, and cinematic media, the show explores the creation-versus-evolution conversation and examines how scientific evidence can connect with the biblical account of creation.",
  },
];

function ShowsSection() {
  return (
    <section id="shows" className="relative scroll-mt-24 bg-forest-night/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="The shows" title="Two productions," accent="one purpose" />

        <div className="mt-16 space-y-20 sm:space-y-28">
          {SHOWS.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={s.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <Reveal from={flip ? "right" : "left"} className={flip ? "lg:order-2" : ""}>
                  <div className="relative mx-auto aspect-square w-full max-w-md">
                    <div className="absolute inset-[8%] rounded-full bg-gold/15 blur-3xl" aria-hidden />
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_35%,#35353a,#0d0d0f)] ring-1 ring-white/10" />
                    <img
                      src={s.logo}
                      alt={`${s.name} logo`}
                      loading="lazy"
                      className="relative h-full w-full object-contain p-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)] transition duration-700 hover:rotate-[-2deg] hover:scale-105"
                    />
                  </div>
                </Reveal>

                <Reveal from={flip ? "left" : "right"} delay={120} className={flip ? "lg:order-1" : ""}>
                  <h3 className="font-display text-4xl font-light leading-tight text-cream sm:text-5xl">{s.name}</h3>
                  <p className="mt-6 text-lg leading-relaxed text-cream/80 text-pretty">{s.body}</p>
                  <a
                    href="#tickets"
                    className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold"
                  >
                    See upcoming dates
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1.5" />
                  </a>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Experience ───────────────────────── */

function ExperienceSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal from="left">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 rotate-2 rounded-[2.25rem] border border-gold/30" aria-hidden />
            <img
              src={actionCroc}
              alt="Rich Aguilera performing on stage during a One Mustard Seed live event"
              loading="lazy"
              width={1400}
              height={2100}
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elevated"
            />
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold">Our experience</span>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight text-cream text-balance sm:text-6xl">
            More than a decade of <span className="italic text-gold">live ministry</span>
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-cream/80 text-pretty">
            For more than a decade, One Mustard Seed has been creating and touring live events designed to inspire kids
            and families. Through engaging stories, powerful visuals, and memorable experiences, these programs have
            helped audiences grow deeper in their faith, better understand the Bible, and see how God’s truth connects
            with the world around them.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-cream/80 text-pretty">
            Our goal has always been bigger than entertainment. We want families to leave encouraged, inspired, and
            thinking more deeply about what they believe.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Faith comes to life ───────────────────────── */

function FaithSection() {
  return (
    <section className="relative bg-forest-night/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold">Every show</span>
            <h2 className="mt-3 font-display text-4xl font-light leading-tight text-cream text-balance sm:text-6xl">
              Faith comes <span className="italic text-gold">to life</span>
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-cream/80 text-pretty">
              From dinosaurs and creation to science, storytelling, and multimedia experiences, each One Mustard Seed
              touring production looks a little different. But the purpose remains the same: create unforgettable
              experiences that help families discover more about God and His world together.
            </p>
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={100}>
              <blockquote className="border-l-2 border-gold pl-6 font-display text-2xl font-light italic leading-snug text-cream sm:text-3xl">
                We believe some of the most powerful ministry happens when parents and children experience something
                together.
              </blockquote>
              <p className="mt-5 pl-6 text-lg leading-relaxed text-cream/75 text-pretty">
                Our live programs are designed to give families those shared moments—moments that can lead to
                questions, conversations, and deeper faith long after the show ends.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-lg leading-relaxed text-cream/80 text-pretty">
                Our touring productions combine storytelling, multimedia, audience interaction, and memorable moments
                into experiences families can enjoy together.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Closing marquee ───────────────────────── */

function MomentsBand() {
  const words = ["Live.", "Interactive.", "Unforgettable."];
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" aria-label="Creating moments families remember">
      <Reveal className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-4xl font-light leading-tight text-cream text-balance sm:text-6xl">
          Creating moments <span className="italic text-gold">families remember</span>
        </h2>
      </Reveal>

      <div className="mt-14 flex w-max animate-marquee gap-12 whitespace-nowrap" aria-hidden>
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex shrink-0 gap-12">
            {[...words, ...words].map((w, i) => (
              <span
                key={`${k}-${i}`}
                className={`font-display text-6xl font-medium italic sm:text-8xl ${
                  i % 3 === 1 ? "text-gold" : "text-transparent [-webkit-text-stroke:1.5px_var(--cream)]"
                }`}
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">Live. Interactive. Unforgettable.</p>
    </section>
  );
}

function EventsPage() {
  return (
    <div className="theme-cinema theme-promo">
      <SiteHeader />
      <main>
        <EventsHero />
        <Ticker items={["Dinosaur Encounter", "The Creation Case LIVE", "Live. Interactive. Unforgettable.", "Family friendly"]} />
        <TicketsSection />
        <ShowsSection />
        <ExperienceSection />
        <FaithSection />
        <MomentsBand />
        <GivingBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
