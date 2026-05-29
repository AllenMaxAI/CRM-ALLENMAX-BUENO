"use client";

import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  LogOut,
  Trash2,
  Save,
  Moon,
  Sun,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const settingSections = [
  { id: "profile", label: "Perfil de Usuario", icon: User, description: "Gestiona tu información personal y avatar." },
  { id: "notifications", label: "Notificaciones", icon: Bell, description: "Configura alertas de leads, pagos y tareas." },
  { id: "security", label: "Seguridad y Acceso", icon: Lock, description: "Contraseña, 2FA y sesiones activas." },
  { id: "appearance", label: "Apariencia", icon: Palette, description: "Personaliza el tema oscuro y colores de acento." },
  { id: "api", label: "API y Webhooks", icon: Zap, description: "Conecta AllenMax con Make, n8n y Stripe." },
  { id: "billing", label: "Suscripción", icon: ShieldCheck, description: "Gestiona tu plan Enterprise OS y facturas." },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sincronizar estado inicial con la clase del documento
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Configuración</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Personaliza tu entorno de trabajo y preferencias globales.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-xs font-bold"
              >
                <Check className="w-4 h-4" />
                Cambios guardados
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 shadow-lg",
              isSaving && "animate-pulse"
            )}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          {settingSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left group relative overflow-hidden",
                activeSection === section.id 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "hover:bg-secondary text-muted-foreground border border-transparent"
              )}
            >
              {activeSection === section.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              <section.icon className={cn("w-5 h-5", activeSection === section.id ? "text-primary" : "group-hover:text-foreground")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{section.label}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{section.description}</p>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", activeSection === section.id ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
          
          <div className="pt-8 space-y-2">
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all text-left group">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-8">
          {activeSection === "profile" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-8"
            >
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    AA
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-primary cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Palette className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Allen Admin</h3>
                  <p className="text-sm text-muted-foreground font-medium">CEO & Automation Specialist • AllenMax AI</p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">Enterprise OS</span>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Verificado</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Nombre Completo", val: "Allen Admin" },
                  { label: "Correo Electrónico", val: "allen@allenmax.ai" },
                  { label: "Cargo / Rol", val: "CEO & Automation Specialist" },
                  { label: "Zona Horaria", val: "Madrid, España (GMT+2)" },
                ].map((f) => (
                  <div key={f.label} className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">{f.label}</label>
                    <input 
                      type="text" 
                      defaultValue={f.val} 
                      className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all hover:bg-secondary" 
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "appearance" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-8"
            >
              <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                <Palette className="w-6 h-6 text-primary" />
                Preferencias de Interfaz
              </h3>
              
              <div className="space-y-4">
                <button 
                  onClick={toggleDarkMode}
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-2xl border transition-all group",
                    isDarkMode ? "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "bg-secondary border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      isDarkMode ? "bg-primary/20 text-primary" : "bg-white text-slate-400 border border-border shadow-sm"
                    )}>
                      {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">Modo Oscuro / OLED</p>
                      <p className="text-[11px] text-muted-foreground">Optimizado para ahorrar energía y descansar la vista.</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-14 h-7 rounded-full relative transition-colors p-1",
                    isDarkMode ? "bg-primary" : "bg-slate-200"
                  )}>
                    <motion.div 
                      animate={{ x: isDarkMode ? 28 : 0 }}
                      className="w-5 h-5 bg-white rounded-full shadow-md" 
                    />
                  </div>
                </button>

                <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary border border-border opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">Animaciones Reducidas</p>
                      <p className="text-[11px] text-muted-foreground">Desactiva efectos visuales para máxima velocidad.</p>
                    </div>
                  </div>
                  <div className="w-14 h-7 bg-slate-200 rounded-full relative p-1">
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Danger Zone */}
          <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4">
            <h3 className="text-sm font-bold text-rose-500 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Zona de Peligro
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Borrar tu cuenta eliminará permanentemente todos tus datos de la bóveda, clientes, proyectos y automatizaciones. Esta acción es irreversible.
            </p>
            <button className="text-xs font-bold text-rose-500 hover:underline px-1">Borrar cuenta permanentemente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
