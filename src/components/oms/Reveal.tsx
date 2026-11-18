import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Fires once when the element scrolls into view. SSR-safe. */
export function useInView<T extends HTMLElement>(threshold = 0.15, rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold, rootMargin]);

  return [ref, seen] as const;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** milliseconds */
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  as?: ElementType;
  style?: CSSProperties;
};

/** Scroll-triggered entrance. Respects prefers-reduced-motion via CSS. */
export function Reveal({ children, className = "", delay = 0, from = "up", as: Tag = "div", style }: RevealProps) {
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-from={from === "up" ? undefined : from}
      className={`reveal ${seen ? "is-visible" : ""} ${className}`}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Counts up to a number once visible, e.g. <CountUp to={100} suffix="+" /> */
export function CountUp({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
