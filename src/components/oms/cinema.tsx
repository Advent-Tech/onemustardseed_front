import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Reveal } from "./Reveal";

/** YouTube-style horizontally scrolling filter chips (sticky under the header). */
export function ChipBar({
  chips,
  active,
  onChange,
  label = "Filter videos",
}: {
  chips: string[];
  active: string;
  onChange: (chip: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="sticky top-20 z-30 -mx-4 border-b border-white/10 bg-black/85 px-4 backdrop-blur-xl sm:top-24 sm:-mx-6 sm:px-6">
      <div ref={ref} role="tablist" aria-label={label} className="flex gap-3 overflow-x-auto py-3 scrollbar-hide">
        {chips.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={on}
              onClick={() => onChange(c)}
              className={`shrink-0 rounded-lg px-4 min-h-11 text-sm font-semibold transition-colors ${
                on ? "bg-cream text-black" : "bg-white/10 text-cream hover:bg-white/20"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type VideoCardProps = {
  to: string;
  params?: Record<string, string>;
  image: string;
  title: string;
  meta?: string;
  badge?: string;
  avatar?: string;
  channel?: string;
  index?: number;
  locked?: ReactNode;
};

/** 16:9 thumbnail, avatar + two-line title + meta — the familiar video card. */
export function VideoCard({ to, params, image, title, meta, badge, avatar, channel, index = 0, locked }: VideoCardProps) {
  return (
    <Reveal delay={(index % 4) * 70}>
      <Link to={to as any} params={params as any} className="group block">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-white/5 transition-all duration-300 group-hover:rounded-md group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/25">
            <span className="grid h-12 w-12 scale-75 place-items-center rounded-full bg-cream/95 text-black opacity-0 shadow-xl transition duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </div>
          {badge && (
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-cream">{badge}</span>
          )}
          {locked}
        </div>
        <div className="mt-3 flex gap-3">
          {avatar && <img src={avatar} alt="" className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-cream object-contain p-1" />}
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-cream">{title}</h3>
            {channel && <p className="mt-1 text-[13px] text-cream/60">{channel}</p>}
            {meta && <p className="text-[13px] text-cream/60">{meta}</p>}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-video rounded-xl" />
          <div className="mt-3 flex gap-3">
            <div className="skeleton h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-11/12 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const VIDEO_GRID = "grid gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
