import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Mail, ArrowRight, Star } from "lucide-react";
import { PageHero } from "@/components/oms/PageHero";
import { Reveal } from "@/components/oms/Reveal";
import { GivingBanner } from "@/components/oms/GivingBanner";
import rich from "@/assets/oms/team-rich.webp";
import leo from "@/assets/oms/team-leo.webp";
import jim from "@/assets/oms/team-jim.webp";
import alex from "@/assets/oms/team-alex.webp";
import angelisse from "@/assets/oms/team-angelisse.webp";

const LEADERSHIP = [
  {
    name: "Rich Aguilera",
    role: "President/Creative Director",
    tagline: "Creative & Visionary",
    bio: "Rich Aguilera is a Christian speaker, producer, writer, and explorer known worldwide as “The Mud Guy.” As founder of One Mustard Seed, he creates live shows, media, books, and resources that help families discover God through nature, science, and adventure.",
    img: rich,
    color: "from-forest-deep to-forest",
    socials: { mail: "mailto:rich@onemustardseed.com" },
  },
  {
    name: "Leo Aguilera",
    role: "Marketing/Operations",
    tagline: "Leadership & Organization",
    bio: "Leo Aguilera leads marketing, operations, partnerships, and national tours for One Mustard Seed. With experience in large-scale events and faith-based media projects, he helps organize productions, strengthen outreach, and keep the mission moving forward with creativity and precision.",
    img: leo,
    color: "from-forest to-sky",
    socials: { mail: "mailto:leo@onemustardseed.com" },
  },
  {
    name: "Jim Aumack",
    role: "Sales/Tours",
    tagline: "Outreach & Relationships",
    bio: "Jim Aumack leads sales, promotion, and tour management for One Mustard Seed. Drawing on decades of experience from his successful career at Worthington Foods, he helps build outreach, partnerships, and ministry opportunities with professionalism, strategy, and purpose.",
    img: jim,
    color: "from-earth to-forest-deep",
    socials: { mail: "mailto:jim@onemustardseed.com" },
  },
  {
    name: "Alex Aguilera",
    role: "Assistant for Operations",
    tagline: "PR & Communications",
    bio: "Alex Aguilera supports operations, production, touring, marketing, communications, and social media for One Mustard Seed while completing his university studies. He helps keep projects organized, tours moving, and ministry content connected with families and audiences.",
    img: alex,
    color: "from-gold to-earth",
    socials: { mail: "mailto:alex@onemustardseed.com" },
  },
  {
    name: "Angelisse Villamizar",
    role: "Production Assistant",
    tagline: "Production & Organization",
    bio: "Angelisse Villamizar supports One Mustard Seed through production organization, script management, CRM, customer communication, and back-office coordination while completing her university studies. Her behind-the-scenes work helps keep projects moving and ministry details organized.",
    img: angelisse,
    color: "from-forest to-gold",
    socials: { mail: "mailto:angelisse@onemustardseed.com" },
  },
];


export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — One Mustard Seed" },
      { name: "description", content: "Meet the people behind One Mustard Seed — creativity, production, outreach and faith in one team." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <PageHero
          eyebrow="Meet the Team"
          ghost="Team"
          title="The people"
          accent="behind OMS"
          subtitle="Our team brings together creativity, organization, production, outreach, and faith to create resources that help children and families grow closer to God."
        />

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {LEADERSHIP.map((m, i) => (
                <Reveal key={m.name} delay={(i % 2) * 100}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-forest-raise ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:ring-gold/40 hover:shadow-elevated sm:min-h-[400px] sm:flex-row">
                    {/* Full-colour portrait; keeps the zoom-on-hover */}
                    <div className="arch-sm relative m-3 aspect-[4/5] shrink-0 overflow-hidden ring-1 ring-gold/30 sm:aspect-auto sm:w-[240px]">
                      <img
                        src={m.img}
                        alt={m.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-raise/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-forest-raise/40" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-7 sm:p-8">
                      <div className="space-y-3">
                        <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold">
                          {m.tagline}
                        </span>
                        <div>
                          <h3 className="font-display text-2xl font-semibold leading-tight text-cream">{m.name}</h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-gold">{m.role}</p>
                        </div>
                        <p className="text-sm font-light leading-relaxed text-cream/75">{m.bio}</p>
                      </div>
                      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                        <a
                          href={m.socials.mail}
                          aria-label={`Email ${m.name}`}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-cream transition hover:border-gold hover:bg-gold hover:text-forest-night"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Connect with leadership */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <Reveal from="scale">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-night ring-1 ring-white/10 shadow-elevated">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(0.8_0.13_85/0.16),transparent_55%)]" />
              <div className="relative grid items-center gap-12 p-10 sm:p-16 lg:grid-cols-2">
                <div className="space-y-6">
                  <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-gold">Join the Story</span>
                  <h2 className="font-display text-4xl font-light leading-tight sm:text-5xl">
                    Want to connect with our <span className="italic text-gold">leadership?</span>
                  </h2>
                  <p className="text-lg font-light leading-relaxed text-cream/75">
                    If you're interested in partnerships, storytelling, or ministry collaboration, our team is ready to listen.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/contact" className="btn-sheen inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-gold-foreground shadow-lg transition hover:scale-105 active:scale-95">
                      Contact the Team <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/support" className="inline-flex items-center rounded-full border border-cream/30 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-cream transition hover:border-gold hover:text-gold">
                      Support Our Work
                    </Link>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="space-y-6 rounded-[2rem] border border-cream/10 bg-cream/5 p-10 backdrop-blur-sm">
                    <Star className="h-8 w-8 text-gold" />
                    <blockquote className="font-display text-2xl font-light italic leading-snug text-cream">
                      "Faith as small as a mustard seed can grow into something bigger than we imagined. We’re trusting God one step at a time."
                    </blockquote>
                    <div className="flex items-center gap-4 pt-2">
                      <img src={rich} alt="Rich Aguilera" className="h-12 w-12 rounded-full border-2 border-gold/40 object-cover object-top" />
                      <div>
                        <p className="text-sm font-bold text-cream">Rich Aguilera</p>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">President/Creative Director</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <GivingBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
