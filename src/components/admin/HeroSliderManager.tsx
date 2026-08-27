import { API_URL, mediaUrl } from "../../lib/api";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Plus, Edit, Trash2, Video } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { toast } from "sonner";
import { Label } from "../ui/label";

const Player = ReactPlayer as any;

export function HeroSliderManager() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);
  const [formData, setFormData] = useState({
    badgeText: "OMS ORIGINAL CINEMA",
    title: "Cinema Hub",
    description: "",
    primaryButtonText: "PLAY FEATURED",
    primaryButtonLink: "",
    secondaryButtonText: "WATCH TRAILER",
    secondaryButtonLink: "",
    backgroundVideoUrl: "",
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${API_URL}/hero-sliders/admin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setSliders(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDialog = (slider: any = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData(slider);
    } else {
      setEditingSlider(null);
      setFormData({
        badgeText: "OMS ORIGINAL CINEMA",
        title: "",
        description: "",
        primaryButtonText: "PLAY FEATURED",
        primaryButtonLink: "",
        secondaryButtonText: "WATCH TRAILER",
        secondaryButtonLink: "",
        backgroundVideoUrl: "",
        order: sliders.length,
        isActive: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("user_token");
    try {
      const url = editingSlider
        ? `${API_URL}/hero-sliders/${editingSlider._id}`
        : `${API_URL}/hero-sliders`;
      const method = editingSlider ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingSlider ? "Slider updated" : "Slider created");
        setIsDialogOpen(false);
        fetchSliders();
      } else {
        toast.error("Failed to save slider");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slider?")) return;
    const token = localStorage.getItem("user_token");
    try {
      const res = await fetch(`${API_URL}/hero-sliders/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setSliders(sliders.filter(s => s._id !== id));
        toast.success("Slider deleted");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem("user_token");
    try {
      const res = await fetch(`${API_URL}/hero-sliders/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setSliders(sliders.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
        toast.success("Status updated");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display">Hero Sliders</h2>
          <p className="text-sm text-muted-foreground">Manage the landing page background videos and texts</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-forest">
          <Plus className="w-4 h-4 mr-2" /> Add Slide
        </Button>
      </div>

      <div className="grid gap-4">
        {sliders.length === 0 ? (
          <div className="p-8 text-center bg-muted/20 rounded-xl border border-border border-dashed">
            <p className="text-muted-foreground">No slides configured. Default fallback will show.</p>
          </div>
        ) : sliders.map((slide) => (
          <Card key={slide._id} className="flex flex-col sm:flex-row gap-4 p-4 items-center bg-card/50">
            <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-black relative shrink-0 pointer-events-none">
              <Player
                url={slide.backgroundVideoUrl}
                playing={true}
                muted={true}
                loop={true}
                width="100%"
                height="100%"
                style={{ objectFit: 'cover', opacity: 0.5 }}
                playsinline={true}
                config={{ vimeo: { playerOptions: { background: true, muted: true, autoplay: true, playsinline: true, loop: true } } as any }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Video className="w-6 h-6 text-white/50" />
              </div>
            </div>
            <div className="flex-grow space-y-2 w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-1 rounded">
                  {slide.badgeText}
                </span>
                {slide.isActive ? (
                  <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">Inactive</span>
                )}
              </div>
              <h3 className="font-display font-bold text-lg">{slide.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{slide.description}</p>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleOpenDialog(slide)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button
                variant={slide.isActive ? "default" : "secondary"}
                size="sm"
                onClick={() => toggleActive(slide._id, slide.isActive)}
                className={slide.isActive ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              >
                {slide.isActive ? "Active" : "Inactive"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(slide._id)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingSlider ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
            <DialogDescription>Configure the background video and call-to-actions for the hero section.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. OMS ORIGINAL CINEMA"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Wonder. Explore. Belong."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description / Tagline</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description..."
              />
            </div>

            <div className="space-y-2">
              <Label>Background Video URL (Vimeo or direct MP4)</Label>
              <Input
                value={formData.backgroundVideoUrl}
                onChange={(e) => setFormData({ ...formData, backgroundVideoUrl: e.target.value })}
                placeholder="https://player.vimeo.com/video/..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <Input
                  value={formData.primaryButtonText}
                  onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Button Link</Label>
                <Input
                  value={formData.primaryButtonLink}
                  onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                  placeholder="/films/watch"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secondary Button Text</Label>
                <Input
                  value={formData.secondaryButtonText}
                  onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Link</Label>
                <Input
                  value={formData.secondaryButtonLink}
                  onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                  placeholder="#trailer"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-forest">
                Save Slide
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
