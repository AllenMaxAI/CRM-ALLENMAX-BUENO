"use client";

import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageCircle, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  User,
  X,
  Check,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const initialLogs = [
  { id: "1", client: "Bank Global Group", type: "email", date: "Hoy, 10:30", summary: "Enviada propuesta técnica v2", status: "completado" },
  { id: "2", client: "Tech Solutions S.A.", type: "whatsapp", date: "Ayer, 16:45", summary: "Confirmación de reunión n8n", status: "completado" },
  { id: "3", client: "Fashion Hub", type: "llamada", date: "22 Abr", summary: "Seguimiento de contrato", status: "perdida" },
  { id: "4", client: "Hotel Ritz Madrid", type: "email", date: "20 Abr", summary: "Dudas sobre asistente de voz", status: "pendiente" },
];

export default function CommunicationPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [showModal, setShowModal] = useState(false);
  const [newLog, setNewLog] = useState({ client: "", type: "email", summary: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const log = {
      id: (logs.length + 1).toString(),
      client: newLog.client,
      type: newLog.type as "email" | "whatsapp" | "llamada",
      date: "Ahora",
      summary: newLog.summary,
      status: "completado" as const
    };
    setLogs([log, ...logs]);
    setShowModal(false);
    setNewLog({ client: "", type: "email", summary: "" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "whatsapp": return MessageCircle;
      case "llamada": return Phone;
      default: return MessageSquare;
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
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
            Interacción registrada correctamente
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Registro de Comunicaciones</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Historial omnicanal de interacciones con clientes y leads.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Interacción</span>
          </button>
        </div>
      </div>

      {/* Interaction Channels Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Emails", value: "1,240", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "WhatsApp", value: "856", icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Llamadas", value: "142", icon: Phone, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Plus className="w-4 h-4 text-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar por cliente o resumen..."
            className="w-full bg-card border border-border rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border">
              <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cliente</th>
              <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Canal</th>
              <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fecha</th>
              <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resumen</th>
              <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => {
              const LogIcon = getIcon(log.type);
              return (
                <tr key={log.id} className="group hover:bg-secondary/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary font-bold">
                        {log.client[0]}
                      </div>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{log.client}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "inline-flex p-2 rounded-xl",
                      log.type === "email" ? "bg-blue-500/10 text-blue-500" :
                      log.type === "whatsapp" ? "bg-emerald-500/10 text-emerald-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      <LogIcon className="w-4 h-4" />
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-muted-foreground">{log.date}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-foreground line-clamp-1">{log.summary}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-secondary rounded-xl transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Nueva Interacción</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLog} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Cliente / Lead</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ej. Bank Global Group"
                    value={newLog.client}
                    onChange={e => setNewLog({...newLog, client: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Canal de Comunicación</label>
                  <div className="flex bg-secondary p-1 rounded-2xl">
                    {["email", "whatsapp", "llamada"].map((type) => (
                      <button 
                        key={type}
                        type="button"
                        onClick={() => setNewLog({...newLog, type: type as any})}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          newLog.type === type ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Resumen de la Interacción</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe brevemente lo ocurrido..."
                    value={newLog.summary}
                    onChange={e => setNewLog({...newLog, summary: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Registrar Interacción
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
