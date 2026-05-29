"use client";

import { 
  Plus, 
  Search, 
  Clock, 
  X, 
  Check, 
  DollarSign, 
  ChevronRight, 
  Timer,
  Building2,
  ArrowRight,
  MessageSquare,
  FileText,
  Users,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { MOCK_PROJECTS, MOCK_CLIENTS, MOCK_FREELANCERS } from "@/lib/mock-data";
import { Project } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [uploadType, setUploadType] = useState<"profile" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalTab, setModalTab] = useState<"specs" | "resources" | "phases">("specs");
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    clientId: "",
    freelancerIds: [] as string[],
    status: "pendiente" as const,
    deadline: "",
    budget: 0,
    description: "",
    progress: 0
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const client = MOCK_CLIENTS.find(c => c.id === p.clientId);
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           client?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "todos" || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const projectClient = useMemo(() => {
    if (!selectedProject) return null;
    return MOCK_CLIENTS.find(c => c.id === selectedProject.clientId);
  }, [selectedProject]);

  const projectFreelancers = useMemo(() => {
    if (!selectedProject) return [];
    return MOCK_FREELANCERS.filter(f => selectedProject.freelancerIds.includes(f.id));
  }, [selectedProject]);

  const updateProjectStatus = (id: string, newStatus: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject({ ...selectedProject, status: newStatus });
    }
  };

  const handleEdit = () => {
    setEditData(selectedProject);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      setProjects(prev => prev.map(p => p.id === editData.id ? editData : p));
      setSelectedProject(editData);
      setIsEditing(false);
    }
  };

  const handleAddProject = () => {
    const project: Project = {
      id: `p-${Date.now()}`,
      ...newProjectData
    };
    setProjects([project, ...projects]);
    setIsAddingProject(false);
    setNewProjectData({
      name: "",
      clientId: "",
      freelancerIds: [],
      status: "pendiente",
      deadline: "",
      budget: 0,
      description: "",
      progress: 0
    });
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !selectedProject) return;

          if (uploadType === "profile") {
            const updatedProject = { ...selectedProject, imageUrl: URL.createObjectURL(file) };
            setSelectedProject(updatedProject);
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
          }
          setUploadType(null);
        }} 
      />
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Gestión de Proyectos</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Control de hitos, entregables y recursos operativos.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-72 shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setIsAddingProject(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Proyecto</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-2xl border border-border w-fit shadow-inner mb-2">
        {["todos", "en_proceso", "pendiente", "completado"].map((status) => (
          <button 
            key={status} 
            onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
            className={cn(
              "px-5 py-2.5 text-[10px] font-outfit font-black uppercase tracking-[0.25em] rounded-xl transition-all active:scale-95 whitespace-nowrap",
              filterStatus === status ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {currentProjects.map((project) => {
          const client = MOCK_CLIENTS.find(c => c.id === project.clientId);
          return (
            <motion.div 
              layout
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 rounded-[2.5rem] bg-card border border-border shadow-sm hover:border-primary/40 transition-all hover:bg-secondary/10 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-6 md:w-[35%]">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground/30 font-black shadow-inner border border-border/50 group-hover:scale-105 transition-transform overflow-hidden">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    project.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-1 h-3 bg-primary rounded-full opacity-50" />
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{client?.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-[10px] font-outfit font-black uppercase tracking-[0.2em] mb-2.5 px-1">
                  <span className="text-muted-foreground opacity-50">Progreso Operativo</span>
                  <span className="text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/30 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className="h-full bg-foreground rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-10 md:w-[25%] justify-end">
                <div className="flex flex-col items-end gap-1.5">
                   <div className="flex items-center gap-2 text-[10px] font-black text-foreground uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{project.deadline}</span>
                   </div>
                   <div className="flex -space-x-1.5">
                      {project.freelancerIds.map((fid) => (
                        <div key={fid} className="w-6 h-6 rounded-lg bg-secondary border border-card flex items-center justify-center text-[8px] font-black ring-2 ring-card hover:z-10 transition-all cursor-default">
                           {MOCK_FREELANCERS.find(f => f.id === fid)?.name[0]}
                        </div>
                      ))}
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "w-10 h-10 rounded-xl font-black text-xs transition-all",
                currentPage === i + 1 ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setSelectedProject(null); setIsEditing(false); }} 
              className="absolute inset-0 bg-background/40 backdrop-blur-sm" 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[80vh]"
            >
              <div className="p-8 md:p-12 pb-0 relative">
                <div className="absolute top-8 right-8 flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        handleEdit();
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isEditing ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-border"
                    )}
                  >
                    {isEditing ? "Guardar" : "Editar"}
                  </button>
                  <button onClick={() => { setSelectedProject(null); setIsEditing(false); }} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  <div 
                    className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-inner relative group cursor-pointer overflow-hidden"
                    onClick={() => { setUploadType("profile"); fileInputRef.current?.click(); }}
                  >
                    {selectedProject.imageUrl ? (
                      <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedProject.name[0]
                    )}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editData?.name} 
                          onChange={e => setEditData(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="text-3xl font-outfit font-black tracking-tight bg-secondary/30 border border-border rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full max-w-md"
                        />
                      ) : (
                        <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">{selectedProject.name}</h2>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{projectClient?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-secondary/50 p-0.5 rounded-lg border border-border">
                        {["pendiente", "en_proceso", "completado"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateProjectStatus(selectedProject.id, status as any)}
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                              selectedProject.status === status 
                                ? status === "completado" ? "bg-emerald-500 text-white shadow-sm" :
                                  status === "en_proceso" ? "bg-amber-500 text-white shadow-sm" :
                                  "bg-blue-500 text-white shadow-sm"
                                : "text-muted-foreground hover:bg-secondary"
                            )}
                          >
                            {status.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 border-b border-border">
                  {[
                    { id: 'specs', label: 'Especificaciones', icon: FileText },
                    { id: 'resources', label: 'Recursos', icon: Users },
                    { id: 'phases', label: 'Fases', icon: Timer }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setModalTab(tab.id as any)}
                      className={cn(
                        "pb-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative",
                        modalTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {modalTab === tab.id && (
                        <motion.div layoutId="modalTabActive" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                      )}
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10 no-scrollbar scroll-smooth">
                <AnimatePresence mode="wait">
                  {modalTab === "specs" && (
                    <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-secondary/20 rounded-[1.5rem] border border-border/40">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-1 flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> Cliente Final
                          </p>
                          <p className="text-lg font-black text-foreground">{projectClient?.name}</p>
                        </div>
                        <div className="p-5 bg-secondary/20 rounded-[1.5rem] border border-border/40 group">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-1 flex items-center gap-2">
                            <Timer className="w-3 h-3" /> Fecha de Entrega
                          </p>
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editData?.deadline} 
                              onChange={e => setEditData(prev => prev ? {...prev, deadline: e.target.value} : null)}
                              className="text-lg font-black bg-transparent border-b border-border focus:outline-none w-full"
                            />
                          ) : (
                            <p className="text-lg font-black">{selectedProject.deadline}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-3 bg-primary rounded-full" />
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground">Descripción del Proyecto</h4>
                        </div>
                        <div className="bg-secondary/10 p-5 rounded-xl border border-border/40 text-[12px] font-medium leading-relaxed text-muted-foreground shadow-inner">
                          {isEditing ? (
                            <textarea 
                              value={editData?.description} 
                              onChange={e => setEditData(prev => prev ? {...prev, description: e.target.value} : null)}
                              className="w-full bg-transparent focus:outline-none min-h-[100px] resize-none"
                            />
                          ) : (
                            selectedProject.description
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {modalTab === "resources" && (
                    <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectFreelancers.map(f => (
                          <div key={f.id} className="p-5 bg-card border border-border/60 rounded-[1.5rem] flex items-center justify-between group hover:border-primary/40 hover:bg-secondary/10 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-black text-sm border border-border/30">{f.name[0]}</div>
                              <div>
                                <p className="text-[15px] font-black tracking-tight">{f.name}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{f.role}</p>
                              </div>
                            </div>
                            <button className="p-3 opacity-0 group-hover:opacity-100 transition-all text-primary hover:bg-primary/10 rounded-xl border border-transparent hover:border-primary/20">
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {modalTab === "phases" && (
                    <motion.div key="phases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Progreso: {selectedProject.progress}%</p>
                          <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedProject.progress}%` }} className="h-full bg-primary" />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const name = prompt("Nombre de la nueva fase:");
                            if (name && selectedProject) {
                              const newPhase = { id: `ph-${Date.now()}`, name, completed: false };
                              const updatedPhases = [...(selectedProject.phases || []), newPhase];
                              const completedCount = updatedPhases.filter(p => p.completed).length;
                              const newProgress = updatedPhases.length > 0 ? Math.round((completedCount / updatedPhases.length) * 100) : 0;
                              const newStatus = newProgress === 100 ? "completado" : (selectedProject.status === "completado" ? "en_proceso" : selectedProject.status);
                              const updatedProject = { ...selectedProject, phases: updatedPhases, progress: newProgress, status: newStatus as any };
                              setSelectedProject(updatedProject);
                              setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
                              if (isEditing) setEditData(updatedProject);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
                        >
                          <Plus className="w-3 h-3" /> Añadir Fase
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProject.phases?.map((phase) => (
                          <div 
                            key={phase.id} 
                            onClick={() => {
                              const updatedPhases = selectedProject.phases?.map(p => p.id === phase.id ? { ...p, completed: !p.completed } : p) || [];
                              const completedCount = updatedPhases.filter(p => p.completed).length;
                              const newProgress = updatedPhases.length > 0 ? Math.round((completedCount / updatedPhases.length) * 100) : 0;
                              const newStatus = newProgress === 100 ? "completado" : (selectedProject.status === "completado" ? "en_proceso" : selectedProject.status);
                              const updatedProject = { ...selectedProject, phases: updatedPhases, progress: newProgress, status: newStatus as any };
                              setSelectedProject(updatedProject);
                              setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
                              if (isEditing) setEditData(updatedProject);
                            }}
                            className={cn(
                              "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                              phase.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border hover:border-primary/40"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                phase.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-border group-hover:border-primary/40"
                              )}>
                                {phase.completed && <Check className="w-3 h-3" />}
                              </div>
                              <span className={cn("text-[10px] font-bold uppercase tracking-widest", phase.completed ? "text-emerald-700/60" : "text-foreground")}>
                                {phase.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 border-t border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                    <Timer className="w-4 h-4" /> 
                    {selectedProject.phases?.filter(p => p.completed).length || 0} / {selectedProject.phases?.length || 0} Fases completadas
                  </div>
                </div>
                  <div className="flex items-center gap-4">
                  <button onClick={() => { setSelectedProject(null); setIsEditing(false); }} className="px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cerrar</button>
                  <button 
                    onClick={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        handleEdit();
                      }
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                  >
                    {isEditing ? "Guardar" : "Editar Proyecto"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddingProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingProject(false)} className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-6 relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">Crear Proyecto</h2>
                  <p className="text-muted-foreground font-medium text-xs mt-1 opacity-60 uppercase tracking-widest">Nueva operación estratégica</p>
                </div>
                <button onClick={() => setIsAddingProject(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-10 pt-0 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Rediseño Plataforma 2024"
                    value={newProjectData.name}
                    onChange={e => setNewProjectData({...newProjectData, name: e.target.value})}
                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Cliente Asociado</label>
                    <select 
                      value={newProjectData.clientId}
                      onChange={e => setNewProjectData({...newProjectData, clientId: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    >
                      <option value="">Seleccionar Cliente</option>
                      {MOCK_CLIENTS.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Fecha Límite</label>
                    <input 
                      type="date" 
                      value={newProjectData.deadline}
                      onChange={e => setNewProjectData({...newProjectData, deadline: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Presupuesto Asignado (€)</label>
                  <input 
                    type="number" 
                    value={newProjectData.budget}
                    onChange={e => setNewProjectData({...newProjectData, budget: parseInt(e.target.value) || 0})}
                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Descripción</label>
                  <textarea 
                    placeholder="Detalles del proyecto..."
                    value={newProjectData.description}
                    onChange={e => setNewProjectData({...newProjectData, description: e.target.value})}
                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={() => setIsAddingProject(false)} className="flex-1 px-8 py-4 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                  <button onClick={handleAddProject} className="flex-[1.5] px-8 py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Iniciar Proyecto</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
