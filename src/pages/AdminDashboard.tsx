import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Plus, Pencil, Trash2, LogOut, ArrowLeft, 
  Save, X, Upload, ExternalLink, Github, Award, FileText, FolderKanban
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// --- Project types & empty ---
interface Project {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github: string;
  demo: string | null;
  live: string | null;
  thumbnail_url: string | null;
  display_order: number;
  is_featured: boolean;
}

const emptyProject: Omit<Project, 'id'> = {
  name: '', description: '', tech_stack: [], github: '',
  demo: null, live: null, thumbnail_url: null, display_order: 0, is_featured: true,
};

// --- Certification types & empty ---
interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  type: string;
  skills: string[];
  verify_url: string | null;
  image_url: string | null;
  display_order: number;
}

const emptyCertification: Omit<Certification, 'id'> = {
  title: '', issuer: '', date: '', description: '', type: 'certification',
  skills: [], verify_url: null, image_url: null, display_order: 0,
};

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Projects state ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [projLoading, setProjLoading] = useState(true);
  const [isProjDialogOpen, setIsProjDialogOpen] = useState(false);
  const [isProjDeleteOpen, setIsProjDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projForm, setProjForm] = useState<Omit<Project, 'id'>>(emptyProject);
  const [techStackInput, setTechStackInput] = useState('');
  const [projSaving, setProjSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // --- Certifications state ---
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certLoading, setCertLoading] = useState(true);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isCertDeleteOpen, setIsCertDeleteOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState<Omit<Certification, 'id'>>(emptyCertification);
  const [skillsInput, setSkillsInput] = useState('');
  const [certSaving, setCertSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) { fetchProjects(); fetchCertifications(); }
  }, [user]);

  // ==================== PROJECTS CRUD ====================
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching projects', description: error.message, variant: 'destructive' });
    } finally { setProjLoading(false); }
  };

  const openAddProject = () => {
    setEditingProject(null);
    setProjForm({ ...emptyProject, display_order: projects.length });
    setTechStackInput(''); setThumbnailFile(null); setThumbnailPreview(null);
    setIsProjDialogOpen(true);
  };

  const openEditProject = (p: Project) => {
    setEditingProject(p);
    setProjForm({ name: p.name, description: p.description, tech_stack: p.tech_stack, github: p.github, demo: p.demo, live: p.live, thumbnail_url: p.thumbnail_url, display_order: p.display_order, is_featured: p.is_featured });
    setTechStackInput(p.tech_stack.join(', '));
    setThumbnailFile(null); setThumbnailPreview(p.thumbnail_url);
    setIsProjDialogOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max 5MB', variant: 'destructive' }); return; }
      setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const uploadThumbnail = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from('project-thumbnails').upload(name, file);
    if (error) throw error;
    return supabase.storage.from('project-thumbnails').getPublicUrl(name).data.publicUrl;
  };

  const saveProject = async () => {
    if (!projForm.name.trim() || !projForm.description.trim() || !projForm.github.trim()) {
      toast({ title: 'Missing required fields', description: 'Name, description, GitHub URL required', variant: 'destructive' }); return;
    }
    setProjSaving(true);
    try {
      let url = projForm.thumbnail_url;
      if (thumbnailFile) url = await uploadThumbnail(thumbnailFile);
      const techStack = techStackInput.split(',').map(s => s.trim()).filter(Boolean);
      const data = { name: projForm.name.trim(), description: projForm.description.trim(), tech_stack: techStack, github: projForm.github.trim(), demo: projForm.demo?.trim() || null, live: projForm.live?.trim() || null, thumbnail_url: url, is_featured: projForm.is_featured };
      if (editingProject) {
        const { error } = await supabase.from('projects').update(data).eq('id', editingProject.id);
        if (error) throw error;
        toast({ title: 'Project updated!' });
      } else {
        const { error } = await supabase.from('projects').insert([data]);
        if (error) throw error;
        toast({ title: 'Project added!' });
      }
      setIsProjDialogOpen(false); fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error saving project', description: error.message, variant: 'destructive' });
    } finally { setProjSaving(false); }
  };

  const deleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id);
      if (error) throw error;
      toast({ title: 'Project deleted!' }); setIsProjDeleteOpen(false); setProjectToDelete(null); fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error deleting project', description: error.message, variant: 'destructive' });
    }
  };

  // ==================== CERTIFICATIONS CRUD ====================
  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase.from('certifications').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setCertifications(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching certifications', description: error.message, variant: 'destructive' });
    } finally { setCertLoading(false); }
  };

  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({ ...emptyCertification, display_order: certifications.length });
    setSkillsInput('');
    setIsCertDialogOpen(true);
  };

  const openEditCert = (c: Certification) => {
    setEditingCert(c);
    setCertForm({ title: c.title, issuer: c.issuer, date: c.date, description: c.description, type: c.type, skills: c.skills, verify_url: c.verify_url, image_url: c.image_url, display_order: c.display_order });
    setSkillsInput(c.skills.join(', '));
    setIsCertDialogOpen(true);
  };

  const saveCert = async () => {
    if (!certForm.title.trim() || !certForm.issuer.trim() || !certForm.date.trim()) {
      toast({ title: 'Missing required fields', description: 'Title, issuer, and date are required', variant: 'destructive' }); return;
    }
    setCertSaving(true);
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const data = {
        title: certForm.title.trim(), issuer: certForm.issuer.trim(), date: certForm.date.trim(),
        description: certForm.description.trim(), type: certForm.type,
        skills, verify_url: certForm.verify_url?.trim() || null,
        image_url: certForm.image_url?.trim() || null, display_order: certForm.display_order,
      };
      if (editingCert) {
        const { error } = await supabase.from('certifications').update(data).eq('id', editingCert.id);
        if (error) throw error;
        toast({ title: 'Certification updated!' });
      } else {
        const { error } = await supabase.from('certifications').insert([data]);
        if (error) throw error;
        toast({ title: 'Certification added!' });
      }
      setIsCertDialogOpen(false); fetchCertifications();
    } catch (error: any) {
      toast({ title: 'Error saving certification', description: error.message, variant: 'destructive' });
    } finally { setCertSaving(false); }
  };

  const deleteCert = async () => {
    if (!certToDelete) return;
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', certToDelete.id);
      if (error) throw error;
      toast({ title: 'Certification deleted!' }); setIsCertDeleteOpen(false); setCertToDelete(null); fetchCertifications();
    } catch (error: any) {
      toast({ title: 'Error deleting certification', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  if (authLoading || projLoading || certLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-xl font-heading font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects" className="gap-2"><FolderKanban className="h-4 w-4" />Projects</TabsTrigger>
            <TabsTrigger value="certifications" className="gap-2"><Award className="h-4 w-4" />Certifications</TabsTrigger>
          </TabsList>

          {/* ============ PROJECTS TAB ============ */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold">Projects</h2>
              <Button onClick={openAddProject}><Plus className="h-4 w-4 mr-2" />Add Project</Button>
            </div>
            {projects.length === 0 ? (
              <Card className="text-center py-12"><CardContent><p className="text-muted-foreground mb-4">No projects yet.</p><Button onClick={openAddProject}><Plus className="h-4 w-4 mr-2" />Add Project</Button></CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    {project.thumbnail_url && (
                      <div className="aspect-video bg-muted"><img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" /></div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-start justify-between gap-2">
                        <span className="line-clamp-1">{project.name}</span>
                        {project.is_featured && <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full whitespace-nowrap">Featured</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 3).map((t) => (<span key={t} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">{t}</span>))}
                        {project.tech_stack.length > 3 && <span className="text-xs text-muted-foreground">+{project.tech_stack.length - 3}</span>}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditProject(project)}><Pencil className="h-3 w-3 mr-1" />Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => { setProjectToDelete(project); setIsProjDeleteOpen(true); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ============ CERTIFICATIONS TAB ============ */}
          <TabsContent value="certifications">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold">Certifications & Publications</h2>
              <Button onClick={openAddCert}><Plus className="h-4 w-4 mr-2" />Add Certification</Button>
            </div>
            {certifications.length === 0 ? (
              <Card className="text-center py-12"><CardContent><p className="text-muted-foreground mb-4">No certifications yet.</p><Button onClick={openAddCert}><Plus className="h-4 w-4 mr-2" />Add Certification</Button></CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {cert.type === 'publication' ? <FileText className="h-4 w-4 text-secondary flex-shrink-0" /> : <Award className="h-4 w-4 text-primary flex-shrink-0" />}
                          <span className="line-clamp-1">{cert.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">#{cert.display_order + 1}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium text-secondary">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">{cert.date}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{cert.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.slice(0, 3).map((s) => (<span key={s} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">{s}</span>))}
                        {cert.skills.length > 3 && <span className="text-xs text-muted-foreground">+{cert.skills.length - 3}</span>}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditCert(cert)}><Pencil className="h-3 w-3 mr-1" />Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => { setCertToDelete(cert); setIsCertDeleteOpen(true); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ============ PROJECT DIALOG ============ */}
      <Dialog open={isProjDialogOpen} onOpenChange={setIsProjDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Project Name *</Label><Input value={projForm.name} onChange={(e) => setProjForm({ ...projForm, name: e.target.value })} placeholder="My Project" /></div>
            <div className="space-y-2"><Label>Description *</Label><Textarea value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} placeholder="Description..." rows={3} /></div>
            <div className="space-y-2"><Label>Tech Stack (comma-separated)</Label><Input value={techStackInput} onChange={(e) => setTechStackInput(e.target.value)} placeholder="Python, React, ..." /></div>
            <div className="space-y-2"><Label>GitHub URL *</Label><div className="relative"><Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={projForm.github} onChange={(e) => setProjForm({ ...projForm, github: e.target.value })} placeholder="https://github.com/..." className="pl-10" /></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Demo URL</Label><Input value={projForm.demo || ''} onChange={(e) => setProjForm({ ...projForm, demo: e.target.value || null })} /></div>
              <div className="space-y-2"><Label>Live URL</Label><div className="relative"><ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={projForm.live || ''} onChange={(e) => setProjForm({ ...projForm, live: e.target.value || null })} className="pl-10" /></div></div>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="is_featured" className="cursor-pointer">Featured Project</Label>
              <Switch id="is_featured" checked={projForm.is_featured} onCheckedChange={(checked) => setProjForm({ ...projForm, is_featured: checked })} />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-start gap-4">
                {thumbnailPreview && (
                  <div className="relative w-32 aspect-video rounded overflow-hidden bg-muted">
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setProjForm({ ...projForm, thumbnail_url: null }); }}><X className="h-3 w-3" /></button>
                  </div>
                )}
                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload thumbnail</span>
                  <span className="text-xs text-muted-foreground mt-1">Max 5MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleThumbnailChange} />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsProjDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveProject} disabled={projSaving}>{projSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-4 w-4" />{editingProject ? 'Update' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ CERTIFICATION DIALOG ============ */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCert ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
            <DialogDescription>Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Title *</Label><Input value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} placeholder="Certificate title" /></div>
            <div className="space-y-2"><Label>Issuer *</Label><Input value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="Issuing organization" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} placeholder="Jan 2024" /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={certForm.type} onValueChange={(v) => setCertForm({ ...certForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="publication">Publication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} placeholder="Brief description..." rows={3} /></div>
            <div className="space-y-2"><Label>Skills (comma-separated)</Label><Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Python, AWS, ..." /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Verify URL</Label><Input value={certForm.verify_url || ''} onChange={(e) => setCertForm({ ...certForm, verify_url: e.target.value || null })} placeholder="https://verify..." /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={certForm.image_url || ''} onChange={(e) => setCertForm({ ...certForm, image_url: e.target.value || null })} placeholder="/certificates/cert.png" /></div>
            </div>
            <div className="space-y-2"><Label>Display Order</Label><Input type="number" min="0" value={certForm.display_order} onChange={(e) => setCertForm({ ...certForm, display_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCertDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCert} disabled={certSaving}>{certSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-4 w-4" />{editingCert ? 'Update' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ DELETE DIALOGS ============ */}
      <AlertDialog open={isProjDeleteOpen} onOpenChange={setIsProjDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Project</AlertDialogTitle><AlertDialogDescription>Delete "{projectToDelete?.name}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCertDeleteOpen} onOpenChange={setIsCertDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Certification</AlertDialogTitle><AlertDialogDescription>Delete "{certToDelete?.title}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteCert} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
