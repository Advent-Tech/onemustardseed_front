import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { mediaUrl } from "@/lib/api";
import { 
  FileText, Download, Mail, Plus, Edit, Trash2, 
  HardDrive, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Swal from "sweetalert2";

export const Route = createFileRoute("/admin/resources")({
  component: ResourceManagement,
});

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function ResourceManagement() {
  const [resources, setResources] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("files");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    isFeatured: false,
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const fetchResources = async () => {
    try {
      const r = await fetch(`${API}/api/resources`);
      const d = await r.json();
      setResources(Array.isArray(d) ? d : (d.data && Array.isArray(d.data) ? d.data : []));
    } catch (e) {
      console.error("Error fetching resources:", e);
      setResources([]);
    }
  };

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const r = await fetch(`${API}/api/resources/leads/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const d = await r.json();
      setLeads(Array.isArray(d) ? d : (d.data && Array.isArray(d.data) ? d.data : []));
    } catch (e) {
      console.error("Error fetching leads:", e);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchLeads();
  }, []);

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleEdit = (resource: any) => {
    setFormData({
      title: resource.title || "",
      description: resource.description || "",
      category: resource.category || "General",
      isFeatured: resource.isFeatured || false,
      isActive: resource.isActive !== false,
    });
    setEditingId(resource._id);
    setFile(null);
    setImage(null);
    setIsUploadOpen(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !file) {
      toast.error("Please select a resource file to upload.");
      return;
    }

    toast.loading(editingId ? "Updating resource..." : "Uploading resource...");
    try {
      let fileUrl = undefined;
      if (file) {
        fileUrl = await fileToBase64(file);
      }
      let featuredImage = undefined;
      if (image) {
        featuredImage = await fileToBase64(image);
      }

      const payload: any = {
        ...formData,
      };
      if (fileUrl) payload.fileUrl = fileUrl;
      if (featuredImage) payload.featuredImage = featuredImage;

      const url = editingId ? `${API}/api/resources/${editingId}` : `${API}/api/resources`;
      const method = editingId ? "PUT" : "POST";
      const token = localStorage.getItem("user_token");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.dismiss();
        toast.success(editingId ? "Resource updated!" : `${formData.title} uploaded successfully!`);
        setIsUploadOpen(false);
        setEditingId(null);
        setFormData({ title: "", description: "", category: "General", isFeatured: false, isActive: true });
        setFile(null);
        setImage(null);
        fetchResources();
      } else {
        toast.dismiss();
        toast.error("Failed to save resource");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await Swal.fire({ 
      title: "Delete Resource?", 
      text: "This cannot be undone.", 
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonColor: "#d33", 
      cancelButtonColor: "#2C4A3B", 
      confirmButtonText: "Delete" 
    });
    if (!res.isConfirmed) return;

    const token = localStorage.getItem("user_token");
    await fetch(`${API}/api/resources/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    fetchResources();
    toast.success("Resource removed");
  };

  const exportLeads = () => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Name,Email,Phone,Resource,Date\n"
      + safeLeads.map(e => `${e.name},${e.email},${e.phone || ''},"${e.resourceTitle}",${new Date(e.createdAt).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFiles = Array.isArray(resources) ? resources.length : 0;
  const activeFiles = Array.isArray(resources) ? resources.filter(r => r.isActive !== false).length : 0;
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const totalDownloads = Array.isArray(resources) ? resources.reduce((a, b) => a + (b.downloadsCount || 0), 0) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-forest">Resource Hub & Freebies</h2>
          <p className="text-muted-foreground">Manage downloadable study guides, books, media assets, and capture leads.</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({ title: "", description: "", category: "General", isFeatured: false, isActive: true }); setFile(null); setImage(null); }} className="bg-forest hover:bg-forest-light h-12 px-6 rounded-xl gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-forest">{editingId ? "Edit Resource" : "Upload New Resource"}</DialogTitle>
              <DialogDescription>Attach the file and optional cover photo. These are distributed free to build community.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. 7-Day Prayer & Fasting Guide" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Study Guides">Study Guides</SelectItem>
                    <SelectItem value="E-Books">E-Books</SelectItem>
                    <SelectItem value="Wallpapers">Wallpapers & Graphics</SelectItem>
                    <SelectItem value="Music Sheets">Music Sheets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Explain what this resource contains and how it helps..." className="rounded-xl resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resource File (PDF / Doc / Image)</Label>
                  <Input type="file" required={!editingId} onChange={e => setFile(e.target.files?.[0] || null)} className="h-11 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-forest/10 file:text-forest cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <Label>Featured Cover Image (Optional)</Label>
                  <Input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="h-11 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-forest/10 file:text-forest cursor-pointer" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-forest h-12 rounded-xl shadow-lg">{editingId ? "Save Changes" : "Publish Resource"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard title="Total Files" value={totalFiles.toString()} icon={FileText} color="forest" />
        <StatsCard title="Active Files" value={activeFiles.toString()} icon={HardDrive} color="gold" />
        <StatsCard title="Total Leads" value={totalLeads.toString()} icon={Mail} color="sky" />
        <StatsCard title="Total Downloads" value={totalDownloads.toString()} icon={Download} color="forest" />
      </div>

      <Tabs defaultValue="files" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="files" className="rounded-lg px-8 data-[state=active]:bg-forest data-[state=active]:text-white transition-all">Files & Assets</TabsTrigger>
          <TabsTrigger value="leads" className="rounded-lg px-8 data-[state=active]:bg-forest data-[state=active]:text-white transition-all">Lead Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50">
                  <TableHead className="font-bold pl-6">Resource Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-center">Downloads</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No resources found. Upload one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  resources.map((file) => (
                    <TableRow key={file._id} className="border-border/50 group hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center border border-forest/10 overflow-hidden shrink-0">
                            {file.featuredImage ? (
                              <img 
                                src={mediaUrl(file.featuredImage)} 
                                className="w-full h-full object-cover" 
                                alt="" 
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-forest" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-base">{file.title}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ""}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-widest px-3">{file.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-bold text-[9px] uppercase tracking-widest px-3 ${file.isActive !== false ? 'bg-forest text-white hover:bg-forest/90 border-transparent' : 'bg-muted text-muted-foreground hover:bg-muted/90 border-transparent'}`}>{file.isActive !== false ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{file.downloadsCount || 0}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-forest/10 hover:text-forest" onClick={() => handleEdit(file)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(file._id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50">
                  <TableHead className="font-bold pl-6">Lead Information</TableHead>
                  <TableHead className="font-bold">Resource Accessed</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No leads captured yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id} className="border-border/50 hover:bg-muted/10 transition-colors">
                      <TableCell className="pl-6">
                        <div className="font-bold text-sm">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email} {lead.phone ? `• ${lead.phone}` : ''}</div>
                      </TableCell>
                      <TableCell className="font-medium text-xs">{lead.resourceTitle}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ""}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-card space-y-4">
            <h3 className="font-bold font-display text-lg">Lead Generation Tools</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export your captured leads for email campaigns, newsletters, or donor relation workflows.
            </p>
            <Button onClick={exportLeads} variant="outline" className="w-full h-11 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest">
              <Download className="w-4 h-4" /> Export CSV List
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: "forest" | "gold" | "sky" }) {
  const colorMap = {
    forest: "bg-forest/10 text-forest",
    gold: "bg-gold/10 text-gold-dark",
    sky: "bg-sky-500/10 text-sky-500",
  };

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-card flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-display font-bold mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  );
}
