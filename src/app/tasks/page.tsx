"use client";

import { 
  Search, 
  Plus, 
  Mic, 
  Sparkles,
  Send,
  MoreHorizontal,
  Circle,
  Inbox,
  X,
  Trash2,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialTasks = [
  { id: "1", title: "Comprar auriculares nuevos", date: "12 May, 2026", status: "Pendiente", filter: "Semana" },
  { id: "2", title: "Pedir cita en el dentista", date: "15 May, 2026", status: "Pendiente", filter: "Mes" },
  { id: "3", title: "Sacar prestado libro de la biblioteca", date: "20 May, 2026", status: "Pendiente", filter: "Día" },
  { id: "4", title: "Leer 'Crea tu segundo cerebro'", date: "31 Mar, 2026", status: "En curso", filter: "Semana" },
  { id: "5", title: "Terminar de planificar las vacaciones", date: "23 Feb, 2026", status: "En curso", filter: "Mes" },
  { id: "6", title: "Llamar a mamá", date: "31 Ene, 2026", status: "Completado", filter: "Día" },
  { id: "7", title: "Alquilar coche", date: "1 Ene, 2026", status: "Completado", filter: "Mes" },
];

const COLUMNS = [
  { id: "Pendiente", color: "bg-rose-500", label: "Pendiente" },
  { id: "En curso", color: "bg-blue-500", label: "En curso" },
  { id: "Completado", color: "bg-emerald-500", label: "Completado" },
  { id: "No Estado", color: "bg-muted-foreground", label: "No Estado", icon: Inbox }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [aiInput, setAiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dateFilter, setDateFilter] = useState<'Todas' | 'Día' | 'Semana' | 'Mes'>('Todas');
  const recognitionRef = useRef<any>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", status: "Pendiente" });

  // Delete Confirm Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'task' | 'column' | null;
    targetId: string | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    targetId: null,
    title: ''
  });

  // Advanced NLP mock to extract multiple tasks, statuses, and dates
  const parseAICommand = (transcript: string) => {
    // Split by common conjunctions
    const parts = transcript.split(/\s+y\s+|\s+además\s+|\s+después\s+|\s+luego\s+/i);
    const results: {title: string, status: string, extractedDate?: string}[] = [];

    parts.forEach(part => {
      let lower = part.toLowerCase();
      let finalStatus = "Pendiente"; // Default
      
      if (lower.includes("en curso") || lower.includes("haciendo")) finalStatus = "En curso";
      else if (lower.includes("completado") || lower.includes("terminado") || lower.includes("ya de")) finalStatus = "Completado";
      else if (lower.includes("no estado") || lower.includes("sin estado")) finalStatus = "No Estado";
      else if (lower.includes("pendiente")) finalStatus = "Pendiente";
      
      // Date extraction
      let extractedDate: string | undefined = undefined;
      const dateMatch = lower.match(/(el\s+el\s+día|el\s+día|el)\s+(\d+\s+de\s+[a-záéíóú]+(?:\s+a\s+las\s+\d+(?:\s+de\s+la\s+(?:tarde|mañana|noche))?)?)/i);
      if (dateMatch) {
        extractedDate = dateMatch[2]; // "7 de mayo a las 5 de la tarde"
        lower = lower.replace(dateMatch[0], "");
      } else {
        const timeMatch = lower.match(/a\s+las\s+\d+(?:\s+de\s+la\s+(?:tarde|mañana|noche))?/i);
        if (timeMatch) {
          extractedDate = timeMatch[0]; // "a las 5 de la tarde"
          lower = lower.replace(timeMatch[0], "");
        }
      }

      if (lower.includes("mañana")) {
         extractedDate = extractedDate ? `Mañana, ${extractedDate}` : "Mañana";
         lower = lower.replace(/\bmañana\b/i, "");
      } else if (lower.includes("hoy")) {
         extractedDate = extractedDate ? `Hoy, ${extractedDate}` : "Hoy";
         lower = lower.replace(/\bhoy\b/i, "");
      }

      // Cleanup
      let cleaned = lower
        .replace(/voy a /g, "")
        .replace(/quiero que a[ñn]adas/g, "")
        .replace(/quiero a[ñn]adir/g, "")
        .replace(/a[ñn]ad[ei]s?/g, "")
        .replace(/crea/g, "")
        .replace(/pon/g, "")
        .replace(/una tarea/g, "")
        .replace(/en pendiente/g, "")
        .replace(/en curso/g, "")
        .replace(/en completado/g, "")
        .replace(/terminado/g, "")
        .replace(/para/g, "")
        .replace(/que sea/g, "")
        .replace(/de he/g, "")
        .replace(/ya de/g, "")
        .replace(/^y /g, "")
        .replace(/el viernes/g, "viernes")
        .replace(/el lunes/g, "lunes")
        .trim();

      if (!cleaned) cleaned = part.trim();
      // Capitalize
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      
      if (cleaned.length > 2) {
        if (extractedDate) {
          // Capitalize the first letter of the extracted date
          extractedDate = extractedDate.charAt(0).toUpperCase() + extractedDate.slice(1);
        }
        results.push({ title: cleaned, status: finalStatus, extractedDate });
      }
    });

    if (results.length === 0) {
      return [{ title: transcript.charAt(0).toUpperCase() + transcript.slice(1), status: "Pendiente" }];
    }
    
    return results;
  };

  const processAndAddAiTasks = (transcript: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const parsedTasks = parseAICommand(transcript || "Tarea generada por voz (n8n)");
      
      const newTasks = parsedTasks.map((parsed, idx) => ({
        id: Date.now().toString() + idx,
        title: parsed.title,
        date: parsed.extractedDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: parsed.status,
        filter: dateFilter === 'Todas' ? 'Día' : dateFilter
      }));

      setTasks(prev => [...newTasks, ...prev]);
      setAiInput("");
      setIsProcessing(false);
      setIsRecording(false);
    }, 1500);
  };

  const handleAiProcess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() && !isRecording) return;
    processAndAddAiTasks(aiInput);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: newTask.status,
      filter: dateFilter === 'Todas' ? 'Día' : dateFilter
    };
    setTasks([task, ...tasks]);
    setShowModal(false);
    setNewTask({ title: "", status: "Pendiente" });
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz. Usa Chrome, Edge o Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setAiInput("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAiInput(transcript);
      processAndAddAiTasks(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Error en reconocimiento de voz", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const confirmDeleteTask = (task: typeof tasks[0]) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'task',
      targetId: task.id,
      title: `¿Eliminar la tarea "${task.title}"?`
    });
  };

  const confirmClearColumn = (columnId: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'column',
      targetId: columnId,
      title: `¿Vaciar todas las tareas de la columna "${columnId}"?`
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.type === 'task') {
      setTasks(tasks.filter(t => t.id !== deleteConfirm.targetId));
    } else if (deleteConfirm.type === 'column') {
      setTasks(tasks.filter(t => t.status !== deleteConfirm.targetId));
    }
    setDeleteConfirm({ isOpen: false, type: null, targetId: null, title: '' });
  };

  const filteredTasks = tasks.filter(t => dateFilter === 'Todas' || t.filter === dateFilter);

  const renderTask = (task: typeof tasks[0]) => (
    <motion.div 
      layout
      key={task.id} 
      className={cn(
        "p-5 bg-card rounded-[1.5rem] border border-border shadow-sm flex flex-col gap-3 group transition-all cursor-grab active:cursor-grabbing relative",
        task.status === "Completado" ? "opacity-60 grayscale-[0.3]" : "hover:border-primary/30 hover:shadow-md"
      )}
    >
      <button 
        onClick={() => confirmDeleteTask(task)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-xl"
        title="Eliminar tarea"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <h3 className={cn(
          "font-bold text-sm text-foreground leading-snug",
          task.status === "Completado" && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] font-medium text-muted-foreground">{task.date}</span>
        {task.status !== "Completado" && (
          <button 
            onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, status: "Completado"} : t))}
            className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md transition-all hover:bg-emerald-500 hover:text-white"
          >
            Completar
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col gap-6 px-10 pt-10 pb-10 font-sans bg-background overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Planificación Inteligente</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Gestión de tareas potenciada por IA (n8n).</p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-secondary/30 p-1.5 rounded-[1.5rem] border border-border/50">
          {['Todas', 'Día', 'Semana', 'Mes'].map(filter => (
            <button 
              key={filter}
              onClick={() => setDateFilter(filter as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                dateFilter === filter ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {filter === 'Todas' && <CalendarDays className="w-3.5 h-3.5" />}
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* AI Input Section */}
      <div className="w-full shrink-0">
        <form 
          onSubmit={handleAiProcess}
          className="relative group bg-secondary/20 border-2 border-border/60 hover:border-primary/30 transition-all rounded-[2rem] p-3 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
             <Sparkles className="w-5 h-5 text-white" />
          </div>
          <input
            type="text"
            disabled={isProcessing || isRecording}
            value={isRecording ? "Escuchando... Habla ahora" : aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Escribe tareas o usa la voz..."
            className={cn(
              "flex-1 bg-transparent border-none focus:outline-none text-sm font-medium tracking-tight",
              isRecording && "text-rose-500 animate-pulse"
            )}
          />
          
          <button 
            type="button"
            onClick={toggleRecording}
            disabled={isProcessing}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shrink-0",
              isRecording 
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse" 
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary shadow-sm"
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <button 
            type="submit"
            disabled={isProcessing || (!aiInput && !isRecording)}
            className="flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isProcessing ? (
              <span className="animate-pulse">Procesando...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar a IA</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Kanban Board Container Wrapper */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar pt-2">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {COLUMNS.map(column => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);
            
            return (
              <div key={column.id} className="flex flex-col w-[340px] shrink-0 h-full bg-secondary/5 border-2 border-border/50 rounded-[3rem] p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-4 px-2 pt-2 shrink-0">
                  <div className="flex items-center gap-2">
                    {column.icon ? (
                      <column.icon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <div className={cn("w-2 h-2 rounded-full", column.color)} />
                    )}
                    <h2 className="text-sm font-black text-foreground">{column.label}</h2>
                    <span className="text-[12px] font-bold text-muted-foreground ml-2">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <div className="relative group/menu">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-secondary/50">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                      <button 
                        onClick={() => confirmClearColumn(column.id)}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Vaciar Columna
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-10 px-1">
                  <AnimatePresence mode="popLayout">
                    {columnTasks.map(renderTask)}
                  </AnimatePresence>
                  
                  {columnTasks.length === 0 && (
                     <div className="py-8 border-2 border-dashed border-border/50 rounded-[1.5rem] flex items-center justify-center text-center opacity-40">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vacío</p>
                     </div>
                  )}

                  <button 
                    onClick={() => {
                      setNewTask({ title: "", status: column.id });
                      setShowModal(true);
                    }}
                    className="w-full flex items-center gap-2 p-3 mt-2 text-muted-foreground hover:text-foreground transition-all group px-4 bg-secondary/10 hover:bg-secondary/30 rounded-[1.5rem]"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Nueva tarea</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Task Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/20 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-card border border-border rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden p-10" >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">Nueva Tarea</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-secondary rounded-2xl transition-colors active:scale-90"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">¿Qué hay que hacer?</label>
                  <input required autoFocus type="text" placeholder="Ej. Revisar contrato" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold tracking-tight" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Columna</label>
                  <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-xs focus:outline-none font-bold tracking-tight cursor-pointer" >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-foreground text-background py-4 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs">Guardar Tarea</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm({...deleteConfirm, isOpen: false})} className="absolute inset-0 bg-black/20 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] p-8 text-center" >
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-outfit font-black text-foreground mb-2">Confirmar Eliminación</h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 px-4 leading-relaxed">{deleteConfirm.title}</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setDeleteConfirm({...deleteConfirm, isOpen: false})}
                  className="flex-1 bg-secondary/50 hover:bg-secondary text-foreground py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

