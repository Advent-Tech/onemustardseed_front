import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { FEATURED_PROJECTS } from "../../../data/home-data";
import { Reveal } from "@/components/oms/Reveal";

/** Bento layout: sizes carry priority (Kids Bible Flix first), and each tile has a light that follows the pointer. */
const SPAN: Record<string, string> = {
  "kids-flix": "lg:col-start-1 lg:row-start-1 lg:col-span-2 lg:row-span-2",
  newsletter: "lg:col-start-3 lg:row-start-1",
  podcast: "lg:col-start-4 lg:row-start-1 lg:row-span-2",
  "about-us": "lg:col-start-3 lg:row-start-2",
  "live-stage-shows": "lg:col-start-1 lg:row-start-3 lg:col-span-2",
  prayer: "lg:col-start-3 lg:row-start-3 lg:col-span-2",
};

function spot(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function FeaturedProjects() {
  return (
    <section id="projects" className="aura relative scroll-mt-8 py-20 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="eyebrow">Featured</span>
            <h2 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight text-cream sm:text-7xl">
              Discover our <span className="italic text-gold">projects</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/resources" className="group inline-flex min-h-11 items-center gap-2 border-b border-gold/50 text-sm font-semibold text-gold transition hover:border-gold">
              View all resources <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[320px] gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[300px] lg:grid-cols-4">
          {FEATURED_PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90} className={`${SPAN[p.id] ?? ""} h-full`}>
              <Link
                to={p.to}
                onMouseMove={spot}
                className="spotlight group relative flex h-full overflow-hidden rounded-[2rem] bg-forest-night ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:ring-gold/50"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={900}
                  height={1125}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07] ${p.id === "newsletter" ? "object-top" : ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/70 to-transparent" />

                <span aria-hidden className="absolute left-5 top-5 font-display text-5xl font-light italic leading-none text-cream/80 outline-text sm:text-6xl">
                  0{i + 1}
                </span>
                <span className="glass absolute right-5 top-5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cream">
                  {p.tag}
                </span>

                <div className="relative z-10 mt-auto w-full p-6 sm:p-7">
                  <h3 className="font-display text-3xl font-light leading-tight text-cream sm:text-4xl">{p.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/80 line-clamp-3">{p.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {p.cta}
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-forest-night transition duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4 -rotate-45" />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
