import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import givingBg from "@/assets/oms/giving-gradient.webp";
import { Reveal, CountUp } from "./Reveal";

const STATS = [
  { to: 20, suffix: "+", label: "Original series" },
  { to: 1, suffix: "M+", label: "Lives reached" },
  { to: 100, suffix: "+", label: "Countries" },
];

/**
 * Giving section — shared across pages (client asked for the gradient
 * background on every giving section). All three buttons go to /support.
 */
export function GivingBanner({ compact = false, showStats = true }: { compact?: boolean; showStats?: boolean }) {
  return (
    <section id="support" className="relative px-4 py-14 sm:px-6 sm:py-20">
      <Reveal from="scale" className="mx-auto max-w-[1440px]">
        <div className="relative isolate overflow-hidden rounded-[2.25rem] shadow-elevated ring-1 ring-white/10">
          <img src={givingBg} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-night/80 via-forest-night/35 to-transparent" />

          <div className={`relative grid gap-12 p-8 sm:p-14 ${compact || !showStats ? "" : "lg:grid-cols-[1.25fr_1fr] lg:p-20"}`}>
            <div>
              <span className="eyebrow">Support the mission</span>
              <h2 className="mt-5 font-display text-5xl font-light leading-[0.95] tracking-tight text-cream sm:text-6xl lg:text-7xl">
                Help plant faith
                <br />
                <span className="italic text-gold">that lasts a lifetime.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 text-pretty">
                Your support helps create stories, songs, live experiences, and resources that point kids to God.
                Together, we can reach families, schools, and churches with faith-building content made for the next generation.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/support" className="cta cta-gold">
                  Give once <span className="cta-dot"><Heart className="h-5 w-5" /></span>
                </Link>
                <Link to="/support" className="cta bg-cream text-forest-night">
                  Give monthly <span className="cta-dot bg-forest-night text-cream"><ArrowRight className="h-5 w-5" /></span>
                </Link>
                <Link to="/support" className="inline-flex min-h-11 items-center border-b border-cream/40 px-1 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold">
                  Learn more →
                </Link>
              </div>
            </div>

            {showStats && !compact && (
              <div className="grid grid-cols-3 gap-3 self-center lg:grid-cols-1">
                {STATS.map((s) => (
                  <div key={s.label} className="glass rounded-3xl p-5 sm:p-6">
                    <div className="font-display text-4xl text-cream sm:text-5xl">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/65 sm:text-[11px]">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
