/** Slow-scrolling ribbon of the ministry's offerings. Decorative, so hidden from assistive tech. */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-white/10 bg-forest-night py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-10">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10 font-display text-2xl font-light italic text-cream/85 sm:text-3xl">
                {t}
                <span className="text-gold not-italic">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
