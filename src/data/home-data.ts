import imgKidsFlix from "@/assets/oms/card-kidsbibleflix.webp";
import imgNewsletter from "@/assets/oms/card-newsletter.webp";
import imgGge from "@/assets/oms/card-gge.webp";
import imgLive from "@/assets/oms/card-live-shows.webp";
import imgAbout from "@/assets/oms/card-about.webp";
import imgPrayer from "@/assets/oms/card-prayer.webp";

/** Homepage "Section Two" — copy and images supplied by the client (Homepage Document OMS Website). */
export const FEATURED_PROJECTS = [
  {
    id: "kids-flix",
    img: imgKidsFlix,
    tag: "Watch",
    title: "Kids Bible Flix",
    desc: "Bible stories, songs, and faith-filled videos made just for kids.",
    cta: "Start watching",
    to: "/kids",
  },
  {
    id: "newsletter",
    img: imgNewsletter,
    tag: "Join",
    title: "Newsletter",
    desc: "Fresh updates, family resources, and encouragement from One Mustard Seed.",
    cta: "Subscribe",
    to: "/newsletter",
  },
  {
    id: "podcast",
    img: imgGge,
    tag: "Listen",
    title: "God’s Great Earth",
    desc: "A fun audio adventure through nature, science, Scripture, and song.",
    cta: "Listen now",
    to: "/podcast",
  },
  {
    id: "live-stage-shows",
    img: imgLive,
    tag: "Live",
    title: "Live Stage Shows",
    desc: "Engaging live experiences that bring faith, adventure, and unforgettable storytelling to the stage.",
    cta: "See events",
    to: "/events",
  },
  {
    id: "about-us",
    img: imgAbout,
    tag: "About",
    title: "About Us",
    desc: "Meet the team helping kids know God through media, events, and resources.",
    cta: "Meet the team",
    to: "/about",
  },
  {
    id: "prayer",
    img: imgPrayer,
    tag: "Watch",
    title: "Week of Prayer Online",
    desc: "Guided prayer videos and resources created for schools and classrooms.",
    cta: "Explore",
    to: "/prayer",
  },
] as const;

/** Homepage "Section One" */
export const HERO_CONTENT = {
  subtitle: "A faith-centered media ministry",
  title: "Helping Kids Know God",
  description: "Through Media, Live Events & Resources",
  primaryCTA: { label: "Live Events", href: "/events" },
  secondaryCTA: { label: "Explore Now", href: "#projects" },
};
