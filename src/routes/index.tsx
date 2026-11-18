import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "../pages/Home/sections/Hero";
import { FeaturedProjects } from "../pages/Home/sections/FeaturedProjects";
import { BirthdayClub } from "../pages/Home/sections/BirthdayClub";
import { GivingBanner } from "@/components/oms/GivingBanner";
import { Ticker } from "@/components/oms/Ticker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "One Mustard Seed — Helping Kids Know God" },
      {
        name: "description",
        content:
          "One Mustard Seed (OMS) is a faith-centered multimedia ministry creating films, podcasts, events, and resources for families, churches, and schools.",
      },
      { property: "og:title", content: "One Mustard Seed — Helping Kids Know God" },
      {
        property: "og:description",
        content:
          "Cinematic films, kid-safe streaming, podcasts, live events, and curriculum from One Mustard Seed Ministries.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Ticker items={["Kids Bible Flix", "Live Stage Shows", "God’s Great Earth", "Week of Prayer", "Kids Bible Beats", "Rich’s Birthday Club"]} />
        <FeaturedProjects />
        <BirthdayClub />
        <GivingBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
