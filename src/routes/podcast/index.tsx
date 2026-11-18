import { API_URL, mediaUrl } from "../../lib/api";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Play, Mic2 } from "lucide-react";
import { usePodcast } from "../podcast";

import applePodcastsLogo from "@/assets/logo/Apple Podcasts.png";
import spotifyLogo from "@/assets/logo/Spotify.png";
import youtubeLogo from "@/assets/logo/YouTube.svg";
import gGeLogo from "@/assets/oms/podcast-gge-logo.webp";
import bookOnTable from "@/assets/oms/podcast-book-on-table.webp";
import overcastLogo from "@/assets/logo/Overcast.png";
import pocketCastsLogo from "@/assets/logo/Pocket Casts.png";
import castboxLogo from "@/assets/logo/Castbox.jpg";
import castroLogo from "@/assets/logo/Castro.png";
import downcastLogo from "@/assets/logo/Downcast.png";

export const Route = createFileRoute("/podcast/")({
  component: PodcastLandingPage,
});

import { useEffect } from "react";


const PLATFORMS = [
  {
    name: "Apple Podcasts",
    url: "https://podcasts.apple.com",
    icon: applePodcastsLogo,
    color: "hover:bg-[#872ec4] hover:text-white hover:border-[#872ec4]",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/show/1yBeid4BY8MGG0ATBxPXP7",
    icon: spotifyLogo,
    color: "hover:bg-[#1ed760] hover:text-black hover:border-[#1ed760]",
  },
  {
    name: "Overcast",
    url: "https://overcast.fm",
    icon: overcastLogo,
    color: "hover:bg-[#fc7e0f] hover:text-white hover:border-[#fc7e0f]",
  },
  {
    name: "Pocket Casts",
    url: "https://pocketcasts.com",
    icon: pocketCastsLogo,
    color: "hover:bg-[#f43e37] hover:text-white hover:border-[#f43e37]",
  },
  {
    name: "Castbox",
    url: "https://castbox.fm",
    icon: castboxLogo,
    color: "hover:bg-[#f55b23] hover:text-white hover:border-[#f55b23]",
  },
  {
    name: "Castro",
    url: "https://castro.fm",
    icon: castroLogo,
    color: "hover:bg-[#00b269] hover:text-white hover:border-[#00b269]",
  },
  {
    name: "Downcast",
    url: "https://downcastapp.com",
    icon: downcastLogo,
    color: "hover:bg-[#1c3c5c] hover:text-white hover:border-[#1c3c5c]",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: youtubeLogo,
    color: "hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000]",
  },
];

const DEFAULT_BANNER = {
  tag: "OMS Podcast Network",
  title: "God's Great Earth Podcast",
  description: "Are you looking for a wild and exciting Christian podcast to listen to? God's Great Earth moves pretty quickly so get comfy and sit back and enjoy this adventure ride to know God better! Hosted by Christian kids TV personality and author, Rich Aguilera.",
  buttonText: "Latest Episode",
  image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
  videoTitle: "The Majesty of the Mountains",
  videoSubtitle: "Watch Episode",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  audioTitle: "The Architecture of Light",
  audioSeasonTitle: "Season 1, Episode 1"
};

function PodcastLandingPage() {
  const { playEpisode } = usePodcast();
  const [activeForm, setActiveForm] = useState<"welcome" | "shoutout" | "brainTeaser" | "joke">("welcome");
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    childName: "",
    location: "",
    content: "",
    fileUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [ebookStatus, setEbookStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [visibleEpisodesCount, setVisibleEpisodesCount] = useState(3);
  const [platforms, setPlatforms] = useState<any[]>(PLATFORMS);

  const [bannerData, setBannerData] = useState(DEFAULT_BANNER);

  useEffect(() => {
    fetch(`${API_URL}/podcast/seasons`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSeasons(data.data.filter((s: any) => s.status === 'Active' || s.status === 'Completed'));
        }
      })
      .catch(console.error);

    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.podcast_banner) {
          setBannerData({ ...DEFAULT_BANNER, ...data.data.podcast_banner });
        }
      })
      .catch(console.error);

    fetch(`${API_URL}/podcast/episodes`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEpisodes(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const resolveUrl = (url: string) => !url ? '' : mediaUrl(url);

  const gGeCover = gGeLogo;
  const latestEp = episodes[0];
  const featuredEpisode = {
    id: latestEp?._id || "featured",
    title: "Strength and Courage",
    duration: latestEp?.duration || "0:00",
    date: latestEp?.createdAt ? new Date(latestEp.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    audioUrl: "/media/strength-and-courage.mp3",
    coverImage: gGeCover,
    seasonTitle: bannerData.audioSeasonTitle || latestEp?.seasonTitle || "Season 1, Episode 1",
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow pt-24">
        {/* Podcast Hero */}
        <section className="relative py-24 overflow-hidden bg-forest-deep text-cream">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_30%,var(--gold),transparent_60%)]" />
          <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-6">
                <Mic2 className="h-3 w-3" /> {bannerData.tag}
              </span>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none">
                {bannerData.title}
              </h1>
              <p className="mt-8 text-lg text-cream/75 leading-relaxed max-w-xl">
                {bannerData.description}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => playEpisode(featuredEpisode)}
                  className="rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-gold-foreground shadow-lg hover:scale-105 transition cursor-pointer inline-block"
                >
                  {bannerData.buttonText}
                </button>
                <div className="flex items-center gap-3">
                  {PLATFORMS.slice(0, 4).map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 grid place-items-center rounded-full bg-cream/10 hover:bg-cream/25 transition cursor-pointer"
                      title={`Listen on ${p.name}`}
                    >
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
                        <img src={p.icon} alt={p.name} className="h-4 w-4 object-contain" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-up [animation-delay:200ms]">
              <div className="relative z-10 overflow-hidden arch shadow-2xl ring-1 ring-gold/30 bg-forest-night">
                <img
                  src={gGeLogo}
                  alt="God's Great Earth"
                  width={1400}
                  height={933}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold">{bannerData.videoSubtitle}</p>
                    <p className="text-xl font-medium">{bannerData.videoTitle}</p>
                  </div>
                  <button
                    onClick={() => playEpisode(featuredEpisode)}
                    aria-label="Play latest episode" className="h-14 w-14 rounded-full bg-cream text-forest-deep grid place-items-center shadow-glow hover:scale-105 hover:bg-gold hover:text-gold-foreground transition cursor-pointer"
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Episodes Grid */}
        <section id="library" className="py-24 bg-background scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl sm:text-5xl font-medium text-foreground">Latest <span className="italic text-primary">Episodes</span></h2>
                <p className="mt-4 text-muted-foreground text-[18px]">Listen to our newest episodes below.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">{episodes.length} Episodes</span>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {episodes.slice(0, visibleEpisodesCount).map((ep, index) => {
                const epNumber = episodes.length - index;
                return (
                  <div key={ep._id} className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-muted border border-border shadow-sm flex flex-col">
                    <img src={ep.image ? resolveUrl(ep.image) : gGeLogo} alt={ep.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-gold text-[10px] font-bold uppercase tracking-widest border border-white/10">Episode {epNumber}</span>
                      {ep.duration && <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">{ep.duration}</span>}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
                      <div>
                        <h3 className="text-2xl font-medium text-cream group-hover:text-gold transition-colors line-clamp-2">{ep.title}</h3>
                        <p className="mt-2 text-sm text-cream/70 line-clamp-2">{ep.description}</p>
                      </div>
                      <button 
                        onClick={() => playEpisode({ id: ep._id, title: ep.title, duration: ep.duration || "0:00", date: new Date(ep.createdAt).toLocaleDateString(), audioUrl: mediaUrl(ep.audioUrl), coverImage: ep.image ? mediaUrl(ep.image) : gGeLogo, seasonTitle: `Episode ${epNumber}` })}
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gold text-gold-foreground font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg cursor-pointer mt-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> Listen Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {episodes.length === 0 && (
              <p className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-muted-foreground">
                New episodes are on the way. Check back soon!
              </p>
            )}
            {episodes.length > 3 && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => {
                    setVisibleEpisodesCount((n) => (n <= 3 ? episodes.length : 3));
                    if (visibleEpisodesCount > 3) document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {visibleEpisodesCount <= 3 ? `View Full Library (${episodes.length} episodes)` : "Show Latest 3 Only"}
                </button>
              </div>
            )}
          </div>
        </section>


        {/* Submit Your Thoughts */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-6xl sm:text-8xl font-medium text-foreground leading-[0.95]">Get <span className="italic text-primary">Involved!</span></h2>
              <p className="mt-4 text-muted-foreground text-[18px]">We want you on the show! This is where you can participate and send your Welcome recordings, Jokes, Brain Teasers, and Shoutout requests!</p>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                { id: "welcome", label: "Welcome Clip" },
                { id: "shoutout", label: "Shoutout" },
                { id: "brainTeaser", label: "Brain Teaser" },
                { id: "joke", label: "Joke" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveForm(tab.id as any); setNotice(null); }}
                  className={`px-6 min-h-11 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeForm === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-background border border-border text-foreground hover:bg-muted"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="w-full grid lg:grid-cols-2 gap-16 items-start transition-opacity duration-500">
              {/* Dynamic Copy */}
              <div className="animate-fade-up">
                {activeForm === "welcome" && (
                  <>
                    <h3 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
                      Submit your <br /><span className="text-primary uppercase">Welcome Clip</span><br /> here!
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-[18px] leading-relaxed">
                      <p>We need kids to do the WELCOME for each episode! Send yours in today!</p>
                      <p>All you have to do is record your child enthusiastically saying this:</p>
                      <p className="font-bold text-foreground italic">"Hello! My name is [FIRST NAME], from [CITY AND STATE/PROVINCE/COUNTRY], welcome to God's Great Earth!"</p>
                      <p className="text-base mt-4">INSTRUCTIONS:<br />Record it with any <strong>audio recorder</strong> on your phone, or even a <strong>video recording</strong> if that's easier. Make sure your child is close to the microphone to get a high-quality recording. Pick your one best recording and send it to us using this form.</p>
                    </div>
                  </>
                )}
                {activeForm === "shoutout" && (
                  <>
                    <h3 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
                      Submit your <br /><span className="text-primary uppercase">Shoutout</span><br /> request here!
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-[18px] leading-relaxed">
                      <p>Submit a request for a shout-out for your child from Rich! You can submit your child's FIRST NAME and LAST NAME INITIAL, plus their LOCATION, and we will give kids a special "SHOUT OUT" during a new segment on the show each week!</p>
                    </div>
                  </>
                )}
                {activeForm === "brainTeaser" && (
                  <>
                    <h3 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
                      Submit your <br /><span className="text-primary uppercase">Brain Teasers</span><br /> here!
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-[18px] leading-relaxed">
                      <p>We need your brain teasers! Send them to us right here!</p>
                    </div>
                  </>
                )}
                {activeForm === "joke" && (
                  <>
                    <h3 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
                      Submit your <br /><span className="text-primary uppercase">Jokes</span><br /> here!
                    </h3>
                    <div className="space-y-4 text-muted-foreground text-[18px] leading-relaxed">
                      <p>Yes! We're looking for all those squeaky-clean jokes! Send them in here!</p>
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Form */}
              <div className="bg-card border border-border rounded-3xl p-8 shadow-sm animate-fade-up">
                <h4 className="text-xl font-medium mb-6 text-foreground">Please fill out this form</h4>
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  if (activeForm === "welcome" && !formData.fileUrl) {
                    setNotice({ ok: false, text: isUploading ? "Your file is still uploading. Please wait a moment, then send." : "Please choose a file to upload first." });
                    return;
                  }
                  setIsSubmitting(true);
                  try {
                    const response = await fetch(`${API_URL}/podcast/submit-form`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...formData, formType: activeForm })
                    });
                    const data = await response.json();
                    if (data.success) {
                      setNotice({ ok: true, text: "Thank you! Your submission has been received." });
                      setFormData({ parentName: "", parentEmail: "", childName: "", location: "", content: "", fileUrl: "" });
                    } else {
                      setNotice({ ok: false, text: data.message || "Something went wrong. Please try again." });
                    }
                  } catch (err) {
                    setNotice({ ok: false, text: "We couldn't send that. Check your connection and try again." });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}>
                  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Parent's name</span><input type="text" required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} /></label>
                  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Parent's email</span><input type="email" required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50" value={formData.parentEmail} onChange={e => setFormData({ ...formData, parentEmail: e.target.value })} /></label>
                  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Child's first name and last initial (example: Rich A.)</span><input type="text" required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50" value={formData.childName} onChange={e => setFormData({ ...formData, childName: e.target.value })} /></label>
                  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">City and state, province or country</span><input type="text" required className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></label>

                  {activeForm === "welcome" && (
                    <div className="pt-2">
                      <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Upload file here!</label>
                      <input type="file" required className="w-full text-base text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploading(true);
                        setFormData((f) => ({ ...f, fileUrl: "" }));
                        try {
                          const uploadData = new FormData();
                          uploadData.append('file', file);
                          const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: uploadData });
                          const data = await res.json();
                          if (data.url) setFormData((f) => ({ ...f, fileUrl: data.url }));
                          else setNotice({ ok: false, text: data.message || "That file couldn't be uploaded. Try a smaller file." });
                        } catch {
                          setNotice({ ok: false, text: "That file couldn't be uploaded. Check your connection and try again." });
                        } finally {
                          setIsUploading(false);
                        }
                      }} />
                    </div>
                  )}
                  {activeForm === "brainTeaser" && (
                    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Brain Teaser</span><textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50 resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea></label>
                  )}
                  {activeForm === "joke" && (
                    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Joke</span><textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-base text-foreground focus:outline-none focus:border-primary/50 resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea></label>
                  )}

                  {notice && <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.ok ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>{notice.text}</p>}
                  <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 mt-4 rounded-xl bg-primary text-primary-foreground font-bold text-base uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-md disabled:opacity-50">
                    {isUploading ? "Uploading file..." : isSubmitting ? "Sending..." : (
                      activeForm === "welcome" ? "Send It In!" :
                      activeForm === "shoutout" ? "Send Your Shout Out!" :
                      activeForm === "brainTeaser" ? "Send That Brain Teaser!" :
                      "Send Me Funny Stuff"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Free E-Book Section */}
        <section className="py-24 bg-forest-deep text-cream">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-up">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-6">
                  GET YOUR FREE E-BOOK OF FIREWALKERS!
                </h2>
                <p className="text-lg text-cream/75 leading-relaxed mb-8">
                  We'd love for your family to try one of our books. Please enter your email to receive the e-book.
                </p>
                <form className="flex flex-col gap-4 max-w-md" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const email = (form.elements[0] as HTMLInputElement).value.trim();
                  setEbookStatus("sending");
                  try {
                    const res = await fetch(`${API_URL}/newsletter/subscribe`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, list: "Podcast Free E-Book", source: "Podcast page" })
                    });
                    if (!res.ok) throw new Error("subscribe failed");
                    // Email saved — start the download.
                    const a = document.createElement("a");
                    a.href = "/downloads/firewalkers-free-ebook.pdf";
                    a.download = "Firewalkers-Free-Ebook.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    form.reset();
                    setEbookStatus("done");
                  } catch (err) {
                    setEbookStatus("error");
                  }
                }}>
                  <label className="block"><span className="mb-1.5 block text-sm font-semibold text-cream">Your email address</span><input type="email" autoComplete="email" required placeholder="name@example.com" className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold" /></label>
                  <button type="submit" className="w-full py-4 rounded-xl bg-gold text-gold-foreground font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg cursor-pointer">
                    {ebookStatus === "sending" ? "One moment..." : "Get My Free E-Book"}
                  </button>
                  {ebookStatus === "done" && <p role="status" className="text-sm text-emerald-200">Thank you! Your free e-book is downloading now.</p>}
                  {ebookStatus === "error" && (
                    <p role="alert" className="text-sm text-red-300">We couldn't send that just now. Please check your email address and try again.</p>
                  )}
                </form>
                <p className="text-xs text-cream/50 mt-4 max-w-md leading-relaxed">
                  We promise to never sell or share your email, and you'll only get a newsletter from us once in a while. You can unsubscribe anytime.
                </p>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <Link to="/shop" className="inline-block px-8 py-4 rounded-xl border border-gold text-gold font-bold text-sm uppercase tracking-widest hover:bg-gold hover:text-gold-foreground transition-colors cursor-pointer">
                    Visit Store
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block animate-fade-up [animation-delay:200ms]">
                <img src={bookOnTable} alt="Firewalkers book on a table" className="w-full max-w-md mx-auto rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-cream/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Listen & Subscribe Platforms */}
        <section className="py-16 bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-[48px] font-medium text-foreground mb-4">Listen & Subscribe</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-[18px]">
              Tune in and follow our podcast on your favorite app. Available on all major platforms:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {platforms.map((p) => {
                let dynamicUrl = p.url;
                if (seasons.length > 0) {
                                    if (p.name === "Apple Podcasts" && seasons[0].applePodcastsUrl) dynamicUrl = seasons[0].applePodcastsUrl;
                }

                return (
                  <a
                    key={p.name}
                    href={dynamicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border border-border bg-background transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-pointer ${p.color}`}
                  >
                    <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center p-1 shadow-sm flex-shrink-0 overflow-hidden">
                      <img src={p.icon} alt={p.name} className="h-full w-full object-contain" />
                    </div>
                    <span className="font-semibold text-sm">{p.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
