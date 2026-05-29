"use client";

import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase, 
  DollarSign, 
  Calendar as CalendarIcon,
  Zap,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Command,
  CheckCircle2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const financeData = [
  { name: "Ene", ingresos: 4000, gastos: 2400 },
  { name: "Feb", ingresos: 3000, gastos: 1398 },
  { name: "Mar", ingresos: 5000, gastos: 2800 },
  { name: "Abr", ingresos: 7800, gastos: 3908 },
  { name: "May", ingresos: 8900, gastos: 4800 },
  { name: "Jun", ingresos: 12000, gastos: 3800 },
  { name: "Jul", ingresos: 15450, gastos: 4300 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [summaryRange, setSummaryRange] = useState("7 meses");

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col gap-6 font-sans overflow-hidden px-10 pt-10 pb-10"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Panel de Control</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Visión estratégica y métricas de rendimiento en tiempo real.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end px-5 py-2.5 bg-card border border-border rounded-2xl shadow-sm">
            <span className="text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-50">Estado Global</span>
            <span className="text-sm font-black text-emerald-500 flex items-center gap-1.5">Excelente <Check className="w-3.5 h-3.5" /></span>
          </div>
          <button className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Acción Rápida</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {[
          { title: "MRR Actual", value: "€15,450", change: "+24%", trend: "up", icon: TrendingUp, color: "text-blue-500" },
          { title: "Cierre Leads", value: "82%", change: "+5.4%", trend: "up", icon: Target, color: "text-violet-500" },
          { title: "Proyectos", value: "12", change: "En curso", trend: "up", icon: Briefcase, color: "text-emerald-500" },
          { title: "Margen Neto", value: "€9,230", change: "+12%", trend: "up", icon: DollarSign, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div 
            variants={item}
            key={i} 
            className="p-6 rounded-[2rem] bg-card border border-border shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={cn("w-9 h-9 rounded-xl bg-secondary flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg border",
                stat.trend === "up" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : "bg-rose-500/5 text-rose-600 border-rose-500/20"
              )}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50 mb-0.5">{stat.title}</p>
              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Activity — fills remaining space */}
      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Chart */}
        <motion.div 
          variants={item}
          className="col-span-2 p-8 rounded-[2.5rem] bg-card border border-border shadow-sm flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-lg font-outfit font-black tracking-tight text-foreground">Rendimiento Financiero</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 mt-0.5">Auditoría de ingresos y proyecciones</p>
            </div>
            <div className="flex bg-secondary p-1.5 rounded-2xl border border-border/50 shadow-inner">
              {["7 meses", "anual"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSummaryRange(r)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[9px] font-outfit font-black uppercase tracking-widest transition-all",
                    summaryRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full" style={{ minHeight: 200 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <AreaChart data={financeData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} dx={-10} />
                <Tooltip 
                  cursor={{ stroke: '#000', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: "20px", backdropFilter: "blur(15px)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }}
                  itemStyle={{ color: "#000", fontWeight: 900, fontSize: "11px", textTransform: "uppercase" }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div 
          variants={item}
          className="p-8 rounded-[2.5rem] bg-card border border-border shadow-sm flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-lg font-outfit font-black tracking-tight text-foreground">Actividad Operativa</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-5 flex-1 overflow-hidden">
            {[
              { label: "Nuevo Lead", sub: "Tech Solutions Inc.", time: "2m", color: "bg-blue-500" },
              { label: "Pago Recibido", sub: "Factura #829 - €450", time: "15m", color: "bg-emerald-500" },
              { label: "Tarea Completada", sub: "Setup n8n Workflow", time: "1h", color: "bg-violet-500" },
              { label: "Nuevo Mensaje", sub: "Sofia (Freelance)", time: "3h", color: "bg-amber-500" },
              { label: "Lead Calificado", sub: "Bank Global Group", time: "5h", color: "bg-blue-500" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className={cn("w-1 h-9 rounded-full shrink-0 group-hover:scale-y-110 transition-all duration-300", activity.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{activity.label}</p>
                  <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest opacity-30 truncate">{activity.sub}</p>
                </div>
                <span className="text-[9px] font-outfit font-black text-muted-foreground uppercase opacity-20 group-hover:opacity-100 transition-opacity mt-0.5">{activity.time}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 rounded-xl bg-secondary border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-foreground hover:text-background transition-all shrink-0">
            Ver Libro de Bitácora
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
