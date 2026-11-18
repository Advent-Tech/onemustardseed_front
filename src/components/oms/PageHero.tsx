import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  /** Plain part of the headline */
  title: ReactNode;
  /** Italic gold part — the brand's signature emphasis */
  accent?: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  align?: "center" | "left";
  /** Giant outlined word that sits behind the headline */
  ghost?: string;
  children?: ReactNode;
};

/** Shared header for inner pages: oversized editorial type, ghost word, warm light. */
export function PageHero({ eyebrow, title, accent, subtitle, image, align = "left", ghost, children }: Props) {
  const center = align === "center";
  return (
    <section className="aura relative isolate overflow-hidden bg-forest-night pb-20 pt-40 sm:pb-28 sm:pt-52">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-night/70 via-forest-night/55 to-forest-deep" />
        </>
      )}
      {ghost && (
        <div aria-hidden className="pointer-events-none absolute -right-[4vw] bottom-[-0.12em] -z-10 select-none whitespace-nowrap font-display text-[clamp(8rem,26vw,26rem)] font-light italic leading-none outline-text opacity-60">
          {ghost}
        </div>
      )}
      <div className={`relative mx-auto max-w-[1320px] px-6 sm:px-10 ${center ? "text-center" : ""}`}>
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 font-display font-light leading-[0.9] tracking-[-0.03em] text-cream text-[clamp(2.8rem,8vw,7.5rem)]">
            {title}
            {accent && (
              <>
                {" "}
                <span className="italic text-gold">{accent}</span>
              </>
            )}
            <span className="text-gold">.</span>
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={220}>
            <p className={`mt-8 max-w-2xl text-lg font-light leading-relaxed text-cream/80 text-pretty sm:text-xl ${center ? "mx-auto" : ""}`}>
              {subtitle}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={340} className={`mt-9 flex flex-wrap gap-4 ${center ? "justify-center" : ""}`}>
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight text-cream text-balance sm:text-6xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="italic text-gold">{accent}</span>
          </>
        )}
      </h2>
    </Reveal>
  );
}
