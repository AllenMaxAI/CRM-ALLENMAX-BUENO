"use client";

import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  X, 
  Check,
  User,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  UserCheck,
  UserPlus,
  UserMinus,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  Eye,
  Trash2,
  PhoneForwarded,
  PhoneOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

// Statuses definitions
const LEAD_STATUSES = [
  { id: "todos", label: "Todos", color: "bg-slate-500", text: "text-slate-600", border: "border-slate-200/50", light: "bg-slate-100/30" },
  { id: "no_contactado", label: "No Contactado", color: "bg-slate-400", text: "text-slate-600", border: "border-slate-200/50", light: "bg-slate-100/30" },
  { id: "contactado", label: "Contactado", color: "bg-blue-500", text: "text-blue-600", border: "border-blue-200/50", light: "bg-blue-100/30" },
  { id: "respondido_si", label: "Respondido (S)", color: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200/50", light: "bg-emerald-100/30" },
  { id: "respondido_no", label: "Respondido (No)", color: "bg-rose-500", text: "text-rose-600", border: "border-rose-200/50", light: "bg-rose-100/30" },
  { id: "llamada", label: "Llamada Agendada", color: "bg-violet-500", text: "text-violet-600", border: "border-violet-200/50", light: "bg-violet-100/30" },
  { id: "rechazado_llamada", label: "Rechazado en Llamada", color: "bg-orange-500", text: "text-orange-600", border: "border-orange-200/50", light: "bg-orange-100/30" },
  { id: "cliente", label: "Convertido a Cliente", color: "bg-emerald-600", text: "text-emerald-700", border: "border-emerald-200/50", light: "bg-emerald-100/30" },
];

const generateMockLeads = () => {
  const names = ["Roberto García", "Laura Rodríguez", "Andrés López", "Silvia Sánchez", "Mateo Pérez", "Clara Martín", "Daniel Ruiz", "Elena Sanz"];
  const companies = ["Tech Solutions", "Fashion Hub", "Bank Global", "Hotel Ritz", "E-commerce Pro", "Cyberdyne", "Global Logist", "AI Systems"];
  const sources = ["LinkedIn", "Web", "Referido", "Campaña Ads"];
  const statuses = LEAD_STATUSES.map(s => s.id).filter(id => id !== "todos");

  return Array.from({ length: 150 }).map((_, i) => ({
    id: (i + 1).toString(),
    name: `${names[i % names.length]} ${i + 1}`,
    company: companies[i % companies.length],
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    email: `lead${i}@${companies[i % companies.length].toLowerCase().replace(' ', '')}.com`,
    date: `${Math.floor(Math.random() * 28) + 1} Abr`,
    priority: i % 3 === 0 ? "alta" : i % 3 === 1 ? "media" : "baja"
  }));
};

const ITEMS_PER_PAGE = 20;

export default function LeadsPage() {
  const [leads, setLeads] = useState(generateMockLeads());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick Action Handler
  const handleQuickAction = (action: string, leadName: string) => {
    alert(`Acción "${action}" ejecutada para ${leadName}`);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           l.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "todos" || l.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchTerm, activeFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const getStatusInfo = (statusId: string) => {
    return LEAD_STATUSES.find(s => s.id === statusId) || LEAD_STATUSES[1];
  };

  return (
    <div className="min-h-full flex flex-col gap-8 font-sans px-10 pt-10 pb-20 relative">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Gestión de Leads</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Seguimiento de oportunidades y embudo de conversión.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary/50 p-1 rounded-xl border border-border">
            <button onClick={() => setViewMode("table")} className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}><LayoutGrid className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Añadir Leads</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-1.5 bg-secondary/30 p-1 rounded-2xl border border-border w-fit shadow-inner">
          {LEAD_STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => { setActiveFilter(status.id); setCurrentPage(1); }}
              className={cn(
                "px-3.5 py-2 text-[9px] font-outfit font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 whitespace-nowrap",
                activeFilter === status.id 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/10 w-full md:w-48 shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Nuevos Hoy", val: "42", color: "text-blue-500" },
          { label: "Contactados", val: "128", color: "text-amber-500" },
          { label: "Respondieron", val: "64", color: "text-emerald-500" },
          { label: "Llamadas", val: "12", color: "text-violet-500" },
          { label: "Tasa Conv.", val: "8.4%", color: "text-primary" },
          { label: "Rechazados", val: "15", color: "text-rose-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-2xl shadow-sm">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={cn("text-xl font-black", stat.color)}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Content View */}
      {viewMode === "table" ? (
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lead / Empresa</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estado Comercial</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Canal</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prioridad</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Últ. Actividad</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentLeads.map((lead) => {
                  const status = getStatusInfo(lead.status);
                  return (
                    <tr key={lead.id} className="group hover:bg-secondary/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground/30 font-black text-sm">
                            {lead.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{lead.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          status.text,
                          status.light,
                          status.border
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lead.source}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                          lead.priority === "alta" ? "bg-rose-500/10 text-rose-500" :
                          lead.priority === "media" ? "bg-amber-500/10 text-amber-500" :
                          "bg-slate-500/10 text-slate-500"
                        )}>
                          {lead.priority}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                           <Clock className="w-3.5 h-3.5 opacity-40" />
                          {lead.date}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleQuickAction('Mail', lead.name)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-blue-500 transition-colors" title="Contactar"><Mail className="w-4 h-4" /></button>
                          <button onClick={() => handleQuickAction('Llamada', lead.name)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-violet-500 transition-colors" title="Agendar Llamada"><PhoneForwarded className="w-4 h-4" /></button>
                          <button onClick={() => handleQuickAction('Convertir', lead.name)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-emerald-500 transition-colors" title="Convertir a Cliente"><UserPlus className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-4 border-t border-border bg-secondary/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Mostrando <span className="text-foreground">{currentLeads.length}</span> de <span className="text-foreground">{filteredLeads.length}</span> prospectos
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black px-4">{currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {currentLeads.map((lead) => {
               const status = getStatusInfo(lead.status);
               return (
                <motion.div
                  layout
                  key={lead.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border p-6 rounded-[2rem] hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center font-black text-xl text-foreground/30">
                      {lead.name[0]}
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                      status.text,
                      status.light,
                      status.border
                    )}>
                      {status.label}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-6">
                    <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{lead.name}</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lead.company}</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      {lead.date}
                    </div>
                    <button onClick={() => handleQuickAction('Ver', lead.name)} className="p-2 hover:bg-secondary rounded-xl text-primary transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
               );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal for adding leads */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 40, scale: 0.98 }} 
              className="relative w-full max-w-xl bg-card border border-border rounded-[2.5rem] shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">Añadir Lead Manual</h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Completa los datos del nuevo prospecto</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Juan Pérez" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email</label>
                  <input type="email" placeholder="juan@empresa.com" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Teléfono</label>
                  <input type="tel" placeholder="+34 600 000 000" className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Canal (Source)</label>
                  <select className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>LinkedIn</option>
                    <option>Web</option>
                    <option>Referido</option>
                    <option>Campaña Ads</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prioridad</label>
                  <div className="flex gap-2">
                    {['Baja', 'Media', 'Alta'].map(p => (
                      <button key={p} className="flex-1 py-2 rounded-xl border border-border bg-card text-[9px] font-black uppercase tracking-widest hover:border-primary/40 transition-all">{p}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Estado Comercial</label>
                  <select className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    {LEAD_STATUSES.filter(s => s.id !== 'todos').map(s => (
                      <option key={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-border hover:bg-secondary transition-all">Cancelar</button>
                <button onClick={() => { alert('Lead añadido con éxito'); setShowAddModal(false); }} className="flex-[2] bg-foreground text-background py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-foreground/10 hover:bg-foreground/90 transition-all">Guardar Prospecto</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
