"use client";

import { 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock,
  CheckCircle2,
  Calendar,
  X,
  Check,
  Globe,
  Camera,
  Video,
  Send,
  Code2,
  MessageSquare,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const initialPosts = [
  { id: "1", title: "Beneficios de la IA en E-commerce", platform: "Linkedin", status: "publicado", date: "Hoy", engagement: "2.4k" },
  { id: "2", title: "Cómo automatizar tu CRM con n8n", platform: "Youtube", status: "programado", date: "25 Abr", engagement: "0" },
  { id: "3", title: "Tips para prompts de Midjourney", platform: "Instagram", status: "borrador", date: "Pendiente", engagement: "0" },
  { id: "4", title: "Lanzamiento AllenMax OS v1.0", platform: "Twitter", status: "publicado", date: "Ayer", engagement: "1.2k" },
];

export default function ContentPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", platform: "Instagram", date: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePlatform, setActivePlatform] = useState("Instagram");

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post = {
      id: (posts.length + 1).toString(),
      title: newPost.title,
      platform: newPost.platform,
      status: "borrador",
      date: newPost.date || "Pendiente",
      engagement: "0"
    };
    setPosts([post, ...posts]);
    setShowModal(false);
    setNewPost({ title: "", platform: "Instagram", date: "" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="h-full flex flex-col gap-0 font-sans overflow-hidden px-0 pt-0 pb-0 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 right-8 z-[100] flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 font-bold" >
            <Check className="w-5 h-5" />
            Contenido programado con éxito
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-10 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Content Factory</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Producción de activos digitales y gestión de contenido.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary/20 p-1.5 rounded-[1.5rem] border border-border/50">
             {["Instagram", "TikTok", "Facebook", "Linkedin"].map(platform => (
                <button 
                 key={platform}
                 onClick={() => setActivePlatform(platform)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                   activePlatform === platform ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-white hover:text-foreground"
                 )}
                >
                  {platform}
                </button>
             ))}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2.5 bg-primary text-white hover:bg-primary/90 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Contenido</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden border-t border-border bg-card/30">
        {/* Navigation / Feed Type */}
        <div className="w-80 border-r border-border bg-secondary/10 p-8 space-y-10 overflow-y-auto no-scrollbar shrink-0">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2 opacity-50">Ecosistema {activePlatform}</h3>
            <div className="space-y-1.5">
              {[
                { label: "Feed Principal", icon: Share2, count: 24 },
                { label: "Pendientes de Aprobación", icon: Clock, count: 5 },
                { label: "Publicados", icon: CheckCircle2, count: 18 },
                { label: "Comentarios", icon: MessageSquare, count: 12 },
                { label: "Likes & Engagement", icon: Share2, count: "4.2k" },
                { label: "Direct Messages", icon: Send, count: 8 },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white hover:text-foreground transition-all group border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] bg-secondary border border-border px-2 py-0.5 rounded-lg opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-[2.5rem] border border-primary/10 relative overflow-hidden group cursor-pointer">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap className="w-12 h-12 text-primary" />
             </div>
             <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-3">Conectar Red</h4>
             <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">Vincula tu cuenta de {activePlatform} para sincronización en tiempo real.</p>
          </div>
        </div>

        {/* Content Feed Grid */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.filter(p => p.platform === activePlatform || activePlatform === "Instagram" && p.platform === "Instagram").map((post) => (
                <motion.div 
                  key={post.id} 
                  whileHover={{ y: -8 }}
                  className="bg-card border border-border rounded-[3rem] shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:border-primary/40 transition-all relative"
                >
                  <div className="aspect-square bg-secondary/30 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform">
                      {activePlatform === "Instagram" ? <Camera className="w-24 h-24" /> : activePlatform === "TikTok" ? <Video className="w-24 h-24" /> : <Globe className="w-24 h-24" />}
                    </div>
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                       <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm",
                        post.status === "publicado" ? "bg-emerald-500 text-white" : post.status === "programado" ? "bg-blue-500 text-white" : "bg-card border border-border text-foreground"
                       )}>{post.status}</span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-black text-base mb-6 line-clamp-2 text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug">{post.title}</h3>
                    
                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <Calendar className="w-4 h-4 opacity-40" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-foreground bg-secondary/50 px-3 py-1.5 rounded-xl border border-border/50">
                        <Share2 className="w-4 h-4 text-primary opacity-60" />
                        <span>{post.engagement}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.button 
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 0.98 }}
                className="aspect-square border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-secondary/10 hover:border-primary/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Programar Post</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden p-10" >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">Planificar Contenido</h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Configuración de despliegue en {activePlatform}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-secondary rounded-2xl transition-colors active:scale-90"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddPost} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Título / Concepto del Contenido</label>
                  <input required type="text" placeholder="Ej. 5 Tips para escalar tu Agencia de IA" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-tight" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Plataforma</label>
                    <select required value={newPost.platform} onChange={e => setNewPost({...newPost, platform: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none font-black uppercase tracking-widest cursor-pointer" >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Linkedin">Linkedin</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Fecha de Despliegue</label>
                    <input required type="text" placeholder="Ej. 12 de Mayo" value={newPost.date} onChange={e => setNewPost({...newPost, date: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none font-black tracking-tight" />
                  </div>
                </div>
                <div className="pt-6">
                  <button type="submit" className="w-full bg-foreground text-background py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Sincronizar y Programar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

