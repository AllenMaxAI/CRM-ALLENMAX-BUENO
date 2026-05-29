"use client";

import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  X,
  Check,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialWorkflows = [
  { id: "1", name: "Sync Leads Facebook -> CRM", active: true, runs: 1240, status: "healthy", platform: "n8n" },
  { id: "2", name: "Auto-reply WhatsApp Support", active: true, runs: 856, status: "healthy", platform: "Make" },
  { id: "3", name: "Invoicing Automation", active: false, runs: 42, status: "error", platform: "Custom" },
  { id: "4", name: "Backup Documents Drive", active: true, runs: 12, status: "healthy", platform: "Zapier" },
];

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [showModal, setShowModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", platform: "n8n" });
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleAddWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    const workflow = {
      id: (workflows.length + 1).toString(),
      name: newWorkflow.name,
      active: true,
      runs: 0,
      status: "healthy" as const,
      platform: newWorkflow.platform
    };
    setWorkflows([workflow, ...workflows]);
    setShowModal(false);
    setNewWorkflow({ name: "", platform: "n8n" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 right-8 z-[100] flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 font-bold" >
            <Check className="w-5 h-5" />
            Automatización desplegada con éxito
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Orquestación de Procesos</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Control de flujos autónomos y agentes de inteligencia artificial.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Nuevo Workflow</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {workflows.map((wf) => (
          <motion.div 
            layoutId={wf.id}
            key={wf.id} 
            className={cn(
              "p-6 rounded-[2rem] bg-card border border-border shadow-sm group hover:border-primary/30 transition-all relative overflow-hidden",
              !wf.active && "grayscale opacity-70"
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "p-3 rounded-2xl bg-secondary transition-transform group-hover:scale-110",
                wf.status === "healthy" ? "text-emerald-500" : "text-rose-500"
              )}>
                <Zap className={cn("w-6 h-6", wf.active && "animate-pulse")} />
              </div>
              <button 
                onClick={() => toggleWorkflow(wf.id)}
                className={cn(
                  "p-2 rounded-xl transition-all active:scale-90",
                  wf.active ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}
              >
                {wf.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
            
            <h3 className="font-black text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{wf.name}</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">{wf.platform} • {wf.runs} ejecuciones</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <div className={cn("w-2 h-2 rounded-full", wf.status === "healthy" ? "bg-emerald-500" : "bg-rose-500")} />
                {wf.status}
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8" >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Crear Automatización</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddWorkflow} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Nombre del Flujo</label>
                  <input required type="text" placeholder="Ej. Sync Leads -> Discord" value={newWorkflow.name} onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Plataforma / Motor</label>
                  <select required value={newWorkflow.platform} onChange={e => setNewWorkflow({...newWorkflow, platform: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none" >
                    <option value="n8n">n8n</option>
                    <option value="Make">Make.com</option>
                    <option value="Zapier">Zapier</option>
                    <option value="Custom">Código Custom</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Desplegar Workflow</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
