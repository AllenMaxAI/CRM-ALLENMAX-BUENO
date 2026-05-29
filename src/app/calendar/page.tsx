"use client";

import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const daysOfWeek = [
  { name: "LUN", date: "4" },
  { name: "MAR", date: "5" },
  { name: "MIÉ", date: "6" },
  { name: "JUE", date: "7" },
  { name: "VIE", date: "8", isCurrent: true },
  { name: "SÁB", date: "9" },
  { name: "DOM", date: "10" }
];

const hours = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00"
];

const treatments = [
  "Limpieza Dental",
  "Revisión de tratamiento",
  "Ortodoncia",
  "Implante Dental",
  "Blanqueamiento",
  "Extracción",
  "Carillas Estéticas",
  "Endodoncia"
];

export default function CalendarPage() {
  const [view, setView] = useState("Semana");
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    date: "2026-05-08",
    time: "09:00",
    treatment: treatments[0]
  });

  return (
    <div className="h-full flex flex-col gap-0 font-sans bg-[#F8F9FB] overflow-hidden relative">
      {/* Header Area */}
      <div className="px-10 pt-10 pb-8 flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-outfit font-black tracking-tight text-[#1a1f2e]">Calendario</h1>
          <p className="text-muted-foreground/60 font-medium text-sm">Programa y gestiona las citas de la clínica</p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Filters */}
          <button className="flex items-center gap-3 px-5 py-2.5 bg-white border border-border/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary/20 transition-all shadow-sm group">
            <Filter className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-foreground">Filtros</span>
            <span className="w-5 h-5 bg-[#1a1f2e] text-white text-[9px] rounded-full flex items-center justify-center font-black">2</span>
          </button>

          {/* View Switcher */}
          <div className="flex bg-secondary/20 p-1 rounded-2xl border border-border/40">
            {["Día", "Semana", "Mes"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-7 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  view === v ? "bg-white text-primary shadow-sm shadow-black/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-muted-foreground border border-transparent hover:border-border/40"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-muted-foreground border border-transparent hover:border-border/40"><ChevronRight className="w-4 h-4" /></button>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2.5 text-sm font-black text-[#1a1f2e] group">
              Mayo <ChevronDown className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="flex items-center gap-2.5 text-sm font-black text-muted-foreground group">
              2026 <ChevronDown className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Today Button */}
          <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Hoy</button>

          {/* New Appointment Button */}
          <button 
            onClick={() => setIsAddingAppointment(true)}
            className="flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="flex-1 px-10 pb-10 overflow-hidden">
        <div className="h-full bg-white border border-border/60 rounded-[3rem] shadow-2xl shadow-black/[0.03] overflow-hidden flex flex-col">
          {/* Grid Header - Days */}
          <div className="flex border-b border-border/50 bg-white z-10 shrink-0">
            <div className="w-[100px] shrink-0 border-r border-border/40 bg-white"></div>
            <div className="flex-1 grid grid-cols-7">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="py-6 text-center border-r border-border/40 last:border-r-0 flex flex-col items-center justify-center gap-1">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]", 
                    day.isCurrent ? "text-[#3b82f6]" : "text-[#1a1f2e]"
                  )}>
                    {day.name}
                  </span>
                  <span className={cn(
                    "text-xl font-outfit font-bold", 
                    day.isCurrent ? "text-[#3b82f6]" : "text-[#1a1f2e]/40"
                  )}>
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Body - Hours */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {hours.map((h, i) => (
              <div key={h} className="flex min-h-[80px] border-b border-border/30 last:border-b-0 group">
                <div className="w-[100px] shrink-0 border-r border-border/30 flex items-center justify-center bg-[#F8F9FB]/50 transition-colors group-hover:bg-secondary/10">
                   <span className="text-[11px] font-bold text-[#1a1f2e] tracking-tight">{h}</span>
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {daysOfWeek.map((_, idx) => (
                     <div key={idx} className="border-r border-border/30 last:border-r-0 relative hover:bg-secondary/10 transition-all cursor-pointer group/cell">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Plus className="w-4 h-4" />
                           </div>
                        </div>
                     </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {isAddingAppointment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAddingAppointment(false)} 
              className="absolute inset-0 bg-[#1a1f2e]/20 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-xl bg-card border border-border/60 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-12 pb-8 relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">Nueva Cita</h2>
                  <p className="text-muted-foreground/60 font-medium text-xs mt-1 uppercase tracking-widest">Registrar nueva sesión técnica</p>
                </div>
                <button onClick={() => setIsAddingAppointment(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all border border-transparent hover:border-border/40">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-12 pb-12 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest px-1">Paciente / Cliente</label>
                    <input type="text" placeholder="Ej: Juan Pérez" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} className="w-full bg-secondary/20 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Fecha de Sesión</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-secondary/20 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Hora</label>
                      <select value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-secondary/20 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none appearance-none" >
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Tratamiento o Servicio</label>
                    <div className="grid grid-cols-2 gap-3">
                      {treatments.map((t) => (
                        <button key={t} onClick={() => setFormData({...formData, treatment: t})} className={cn( "px-4 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all text-left", formData.treatment === t ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-border/40 text-muted-foreground hover:bg-secondary/40" )} >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button onClick={() => setIsAddingAppointment(false)} className="flex-1 px-8 py-5 rounded-3xl border border-border/60 bg-secondary/10 text-[10px] font-black uppercase tracking-widest hover:bg-secondary/30 transition-all">Cancelar</button>
                  <button onClick={() => setIsAddingAppointment(false)} className="flex-[1.8] px-8 py-5 rounded-3xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-2" >
                    Registrar Cita
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

