"use client";

import { 
  Code2, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Database, 
  Cloud, 
  Lock,
  X,
  Check,
  FileJson,
  Copy,
  Download,
  Eye,
  FileCode,
  Zap,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";

const initialResources = [
  { 
    id: "1", 
    name: "Workflow: Onboarding Cliente", 
    category: "Automatización", 
    type: "n8n", 
    version: "1.2.0", 
    date: "2024-05-01",
    status: "activo",
    content: `{
  "nodes": [
    {
      "parameters": {
        "eventName": "client_onboarded"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "version": 1
    }
  ]
}`
  },
  { 
    id: "2", 
    name: "Prompt: Generador de Copys SEO", 
    category: "IA", 
    type: "Prompt", 
    version: "2.1.0", 
    date: "2024-04-28",
    status: "verificado",
    content: "Actúa como un copywriter senior especializado en SEO. Tu tarea es generar meta-descripciones de 155 caracteres..."
  },
  { 
    id: "3", 
    name: "API: Webhook de Facturación", 
    category: "Finanzas", 
    type: "JSON", 
    version: "1.0.0", 
    date: "2024-05-05",
    status: "activo",
    content: `{
  "invoice_id": "string",
  "amount": "number",
  "currency": "EUR",
  "status": "string"
}`
  },
  { 
    id: "4", 
    name: "Script: Limpieza de Leads", 
    category: "Operaciones", 
    type: "Script", 
    version: "0.8.5", 
    date: "2024-05-02",
    status: "borrador",
    content: "function cleanLeads(leads) { return leads.filter(l => l.email); }"
  },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState(initialResources);
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [newResource, setNewResource] = useState({ name: "", category: "Automatización", type: "n8n", content: "", version: "1.0.0" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    const resource = {
      id: Date.now().toString(),
      ...newResource,
      date: new Date().toISOString().split('T')[0],
      status: "activo"
    };
    setResources([resource, ...resources]);
    setShowModal(false);
    setNewResource({ name: "", category: "Automatización", type: "n8n", content: "", version: "1.0.0" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setNewResource(prev => ({
          ...prev,
          name: file.name.replace('.json', ''),
          content: content,
          type: file.name.endsWith('.json') ? "JSON" : "Script"
        }));
      };
      reader.readAsText(file);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesTab = activeTab === "Todas" || r.type.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [resources, activeTab, searchTerm]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Podríamos añadir una notificación aquí
  };

  return (
    <div className="h-full flex flex-col gap-0 font-sans overflow-hidden px-0 pt-0 pb-0 relative">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json,.js,.txt" />
      
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-[100] flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 font-bold"
          >
            <Check className="w-5 h-5" />
            Recurso técnico guardado
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-10 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Recursos Técnicos & Automatización</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Gestión de workflows n8n, JSON schemas, prompts y APIs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar workflow o prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-3.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Recurso</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-card/30">
        {/* Sidebar Categories */}
        <div className="w-72 bg-secondary/10 p-6 space-y-8 overflow-y-auto no-scrollbar shrink-0 border-r border-border/50">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2 opacity-50">Categorías</h3>
            <div className="space-y-1">
              {["Todas", "n8n", "Prompt", "JSON", "Script"].map(type => (
                <button 
                  key={type} 
                  onClick={() => setActiveTab(type)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === type 
                      ? "bg-foreground text-background shadow-lg" 
                      : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {type === "n8n" && <Zap className="w-3.5 h-3.5" />}
                    {type === "Prompt" && <MessageSquare className="w-3.5 h-3.5" />}
                    {type === "JSON" && <FileJson className="w-3.5 h-3.5" />}
                    {type === "Script" && <FileCode className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </div>
                  <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-lg font-black",
                    activeTab === type ? "bg-background/20 text-background" : "bg-secondary border border-border text-foreground"
                  )}>
                    {type === "Todas" ? resources.length : resources.filter(r => r.type === type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2 opacity-50">Estadísticas</h3>
            <div className="space-y-4 px-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Activos</span>
                <span className="text-[9px] font-black text-foreground">85%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%]" />
              </div>
              <p className="text-[8px] font-medium text-muted-foreground leading-relaxed">Repositorio sincronizado con la nube institucional.</p>
            </div>
          </div>
        </div>

        {/* Main Resource List */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-6xl mx-auto bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border">
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Nombre del Recurso</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Área</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Versión</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Fecha</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="group hover:bg-secondary/20 transition-all cursor-default">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black border border-border/50 group-hover:scale-105 transition-transform shadow-inner",
                            resource.type === "n8n" ? "bg-amber-500/10 text-amber-500" :
                            resource.type === "Prompt" ? "bg-blue-500/10 text-blue-500" :
                            resource.type === "JSON" ? "bg-emerald-500/10 text-emerald-500" :
                            "bg-secondary text-primary"
                          )}>
                            {resource.type === "n8n" && <Zap className="w-5 h-5" />}
                            {resource.type === "Prompt" && <MessageSquare className="w-5 h-5" />}
                            {resource.type === "JSON" && <FileJson className="w-5 h-5" />}
                            {resource.type === "Script" && <FileCode className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="font-black text-sm text-foreground group-hover:text-primary transition-colors tracking-tight block">{resource.name}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{resource.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-secondary text-foreground uppercase tracking-widest border border-border">
                          {resource.category}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                         <span className="text-[11px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">v{resource.version}</span>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-[11px] font-black text-muted-foreground">{resource.date}</span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedResource(resource)}
                            className="p-3 bg-secondary/50 hover:bg-foreground hover:text-background rounded-xl transition-all text-muted-foreground shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => copyToClipboard(resource.content)}
                            className="p-3 bg-secondary/50 hover:bg-foreground hover:text-background rounded-xl transition-all text-muted-foreground shadow-sm"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedResource(null)} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-3xl bg-card border border-border rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="p-10 pb-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {selectedResource.type === "n8n" ? <Zap className="w-6 h-6" /> : <FileJson className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">{selectedResource.name}</h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Versión {selectedResource.version} • {selectedResource.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => copyToClipboard(selectedResource.content)}
                    className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </button>
                  <button onClick={() => setSelectedResource(null)} className="p-3 hover:bg-secondary rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="flex-1 p-10 pt-0 overflow-hidden">
                <div className="h-full bg-secondary/20 rounded-[2rem] border border-border p-6 overflow-y-auto no-scrollbar font-mono text-[13px] leading-relaxed relative">
                  <pre className="text-muted-foreground whitespace-pre-wrap">{selectedResource.content}</pre>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-card border border-border rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden p-10" >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">Ingesta Técnica</h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Subir workflow, prompt o esquema JSON</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-secondary rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddResource} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Nombre</label>
                    <input required type="text" placeholder="Ej. Sync HubSpot-Stripe" value={newResource.name} onChange={e => setNewResource({...newResource, name: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-tight" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Versión</label>
                    <input required type="text" placeholder="1.0.0" value={newResource.version} onChange={e => setNewResource({...newResource, version: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-tight" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Categoría</label>
                    <select required value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value as any})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none font-black uppercase tracking-widest cursor-pointer" >
                      <option value="n8n">n8n Workflow</option>
                      <option value="Prompt">AI Prompt</option>
                      <option value="JSON">JSON Schema</option>
                      <option value="Script">JS Script</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Área</label>
                    <select required value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none font-black uppercase tracking-widest cursor-pointer" >
                      <option value="Automatización">Automatización</option>
                      <option value="IA">IA & ML</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Operaciones">Operaciones</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Contenido / Código</label>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      O subir archivo .json/.js
                    </button>
                  </div>
                  <textarea 
                    required 
                    placeholder="Pega aquí el JSON o el texto del recurso..." 
                    value={newResource.content} 
                    onChange={e => setNewResource({...newResource, content: e.target.value})} 
                    className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 h-40 resize-none no-scrollbar"
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-foreground text-background py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Guardar Recurso Técnico</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


