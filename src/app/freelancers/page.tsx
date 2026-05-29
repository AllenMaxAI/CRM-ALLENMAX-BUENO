"use client";

import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  Mail, 
  X,
  Briefcase,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Zap,
  BadgeCheck,
  Building2,
  Code2,
  ArrowRight,
  FileText,
  Settings,
  Receipt,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_FREELANCERS, MOCK_PROJECTS, MOCK_CLIENTS, MOCK_INVOICES, MOCK_CONTRACTS } from "@/lib/mock-data";
import { Freelancer, Invoice, Contract } from "@/types";

const ITEMS_PER_PAGE = 8;

export default function FreelancersPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [freelancers, setFreelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"projects" | "history" | "info" | "skills" | "invoices" | "budgets" | "contracts">("projects");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Freelancer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [uploadType, setUploadType] = useState<"invoice" | "budget" | "contract" | "profile" | "edit_invoice" | "edit_budget" | "edit_contract" | null>(null);
  const [isAddingFreelancer, setIsAddingFreelancer] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemEditData, setItemEditData] = useState<any>(null);
  const [newFreelancerData, setNewFreelancerData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    hourlyRate: 0,
    status: "activo" as const,
    skills: [] as string[],
    rating: 5.0,
    invoice: "",
    budget: "",
    contract: "",
    avatar: "",
    projectHistory: []
  });

  const filteredFreelancers = useMemo(() => {
    return freelancers.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [freelancers, searchTerm]);

  const totalPages = Math.ceil(filteredFreelancers.length / ITEMS_PER_PAGE);
  const currentFreelancers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFreelancers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFreelancers, currentPage]);

  const freelancerProjects = useMemo(() => {
    if (!selectedFreelancer) return [];
    return MOCK_PROJECTS.filter(p => p.freelancerIds.includes(selectedFreelancer.id));
  }, [selectedFreelancer]);

  const freelancerClients = useMemo(() => {
    if (!selectedFreelancer) return [];
    const clientIds = new Set(freelancerProjects.map(p => p.clientId));
    return MOCK_CLIENTS.filter(c => clientIds.has(c.id));
  }, [selectedFreelancer, freelancerProjects]);

  const handleEdit = () => {
    setEditData(selectedFreelancer);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      setFreelancers(prev => prev.map(f => f.id === editData.id ? editData : f));
      setSelectedFreelancer(editData);
      setIsEditing(false);
    }
  };

  const handleAddFreelancer = () => {
    const freelancer: Freelancer = {
      id: `f-${Date.now()}`,
      ...newFreelancerData
    };
    setFreelancers([freelancer, ...freelancers]);
    setIsAddingFreelancer(false);
    setNewFreelancerData({
      name: "",
      role: "",
      email: "",
      phone: "",
      hourlyRate: 0,
      status: "activo",
      skills: [],
      rating: 5.0,
      invoice: "",
      budget: "",
      contract: "",
      avatar: "",
      projectHistory: []
    });
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Red de Freelancers</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Gestión de talento externo y colaboradores especializados.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar especialista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-72 shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setIsAddingFreelancer(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo Freelancer</span>
          </button>
        </div>
      </div>

      {/* Grid of Freelancers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {currentFreelancers.map((f, idx) => (
            <motion.div
              layout
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedFreelancer(f)}
              className="group bg-card border border-border hover:border-primary/30 rounded-[2.5rem] p-6 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground/30 font-black text-xl shadow-inner border border-border group-hover:scale-110 transition-transform duration-500">
                  {f.name[0]}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  f.status === "activo" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                )}>
                  {f.status}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-outfit font-black text-xl text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">{f.name}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{f.role}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {f.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-secondary/50 text-[9px] font-black text-foreground uppercase tracking-wider">{skill}</span>
                ))}
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-[11px] font-black">{f.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="text-[10px] font-black uppercase tracking-widest">Ver Perfil</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-2xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-all shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={cn("w-10 h-10 rounded-2xl text-xs font-black transition-all", currentPage === i + 1 ? "bg-foreground text-background shadow-lg" : "bg-card border border-border text-muted-foreground hover:bg-secondary")}>{i + 1}</button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-2xl border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-all shadow-sm"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFreelancer && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedFreelancer(null); setIsEditing(false); }} className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[85vh]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file || !selectedFreelancer) return;

                  if (uploadType === "invoice") {
                    const newInv: Invoice = {
                      id: `INV-${Date.now()}`,
                      clientId: "unknown", // Freelancer specific invoices might not have a client yet
                      amount: 0,
                      date: new Date().toISOString().split('T')[0],
                      dueDate: new Date().toISOString().split('T')[0],
                      status: "pending",
                      items: [{ description: file.name, amount: 0 }]
                    };
                    setInvoices(prev => [newInv, ...prev]);
                    setActiveTab("invoices");
                  } else if (uploadType === "edit_invoice" && editingItemId) {
                    setItemEditData((prev: any) => prev ? {...prev, id: file.name} : null);
                  } else if (uploadType === "budget") {
                    const newBudget = {
                      id: `BGT-${Date.now()}`,
                      title: file.name,
                      date: new Date().toISOString().split('T')[0],
                      amount: 0
                    };
                    setBudgets(prev => [newBudget, ...prev]);
                    setActiveTab("budgets");
                  } else if (uploadType === "edit_budget" && editingItemId) {
                    setItemEditData((prev: any) => prev ? {...prev, title: file.name} : null);
                  } else if (uploadType === "contract") {
                    const newContract: Contract = {
                      id: `CTR-${Date.now()}`,
                      clientId: "unknown",
                      title: file.name,
                      signedDate: new Date().toISOString().split('T')[0],
                      fileUrl: "#",
                      status: "active"
                    };
                    setContracts(prev => [newContract, ...prev]);
                    setActiveTab("contracts");
                  } else if (uploadType === "edit_contract" && editingItemId) {
                    setItemEditData((prev: any) => prev ? {...prev, title: file.name} : null);
                  }
                  setUploadType(null);
                }} 
              />
              <div className="p-8 md:p-12 pb-0 relative">
                <div className="absolute top-8 right-8 flex items-center gap-4">
                  <button onClick={() => { setSelectedFreelancer(null); setIsEditing(false); }} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer" onClick={() => { setUploadType("profile"); fileInputRef.current?.click(); }}>
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20 overflow-hidden">
                      {selectedFreelancer.name[0]}
                    </div>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-6 h-6 text-white" />
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
                        <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">{selectedFreelancer.name}</h2>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">Top Rated</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5" />
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editData?.role} 
                            onChange={e => setEditData(prev => prev ? {...prev, role: e.target.value} : null)}
                            className="text-[10px] font-bold uppercase tracking-widest bg-secondary/30 border border-border rounded-lg px-2 py-0.5 focus:outline-none"
                          />
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest">{selectedFreelancer.role}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 border-b border-border">
                  {[
                    { id: 'projects', label: 'Activos', icon: Briefcase },
                    { id: 'history', label: 'Historial', icon: BadgeCheck },
                    { id: 'info', label: 'Información', icon: Users },
                    { id: 'invoices', label: 'Facturas', icon: Receipt },
                    { id: 'budgets', label: 'Presupuestos', icon: BarChart3 },
                    { id: 'contracts', label: 'Contratos', icon: ShieldCheck }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "pb-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative",
                        activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {activeTab === tab.id && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                      )}
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10 no-scrollbar scroll-smooth">
                <AnimatePresence mode="wait">
                  {activeTab === "projects" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancerProjects.length > 0 ? freelancerProjects.map(project => {
                          const client = MOCK_CLIENTS.find(c => c.id === project.clientId);
                          const fData = selectedFreelancer ? project.freelancerData?.[selectedFreelancer.id] : null;
                          return (
                            <div key={project.id} className="bg-card border border-border p-6 rounded-[2rem] hover:shadow-xl transition-all group relative overflow-hidden">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground/40 font-black text-xs shrink-0">{client?.name[0]}</div>
                                  <h5 className="font-black text-sm truncate group-hover:text-primary transition-colors">{project.name}</h5>
                                </div>
                                <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", project.status === "completado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>{project.status.replace('_', ' ')}</div>
                              </div>
                              
                              <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                                <div className="flex justify-between items-center"><p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Progreso</p><p className="text-[10px] font-black text-foreground">{project.progress}%</p></div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-primary" /></div>
                              </div>
                              
                              {fData && (
                                <div className="mt-4 pt-4 flex items-center justify-between border-t border-border/50">
                                  <div>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Presupuesto</p>
                                    <p className="text-xs font-black text-foreground">€{fData.payment.toLocaleString()}</p>
                                  </div>
                                  {fData.invoiceUrl && <Zap className="w-4 h-4 text-emerald-500" />}
                                </div>
                              )}
                            </div>
                          );
                        }) : (
                          <div className="col-span-full py-12 text-center bg-secondary/10 rounded-3xl border border-dashed border-border">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">No hay proyectos activos</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "history" && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedFreelancer?.projectHistory?.map(project => (
                          <div key={project.projectId} className="bg-secondary/10 border border-border/50 p-6 rounded-[2rem] hover:bg-card hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <div className="overflow-hidden">
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{project.date}</p>
                                <h5 className="font-black text-sm truncate group-hover:text-primary transition-colors">{project.projectName}</h5>
                              </div>
                              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">Finalizado</div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                              <div>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pago Recibido</p>
                                <p className="text-xs font-black text-foreground">€{project.payment.toLocaleString()}</p>
                              </div>
                              {project.invoiceUrl && <FileText className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "info" && (
                    <motion.div 
                      key="info"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      {/* Column 1: Performance */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <h4 className="text-[11px] font-outfit font-black text-amber-500 uppercase tracking-[0.2em]">Rendimiento</h4>
                        </div>
                        <div className="bg-secondary/20 p-6 rounded-[2rem] border border-border/50 shadow-inner">
                          <div className="space-y-5">
                            <div>
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Rating Actual</p>
                              <div className="flex items-center gap-2">
                                <p className="text-3xl font-black text-foreground">{selectedFreelancer?.rating}</p>
                                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                              </div>
                            </div>
                            <div className="pt-5 border-t border-border/50">
                              <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Proyectos</p>
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-black text-foreground">{(freelancerProjects.length || 0) + (selectedFreelancer?.projectHistory?.length || 0)}</p>
                                <BadgeCheck className="w-5 h-5 text-emerald-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Contact */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-primary" />
                          <h4 className="text-[11px] font-outfit font-black text-primary uppercase tracking-[0.2em]">Contacto</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"><Mail className="w-5 h-5" /></div>
                            <div className="overflow-hidden">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Email</p>
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editData?.email} 
                                  onChange={e => setEditData(prev => prev ? {...prev, email: e.target.value} : null)}
                                  className="text-sm font-bold truncate bg-transparent border-none p-0 focus:ring-0 w-full"
                                />
                              ) : (
                                <p className="text-sm font-bold truncate text-foreground">{selectedFreelancer.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0"><Zap className="w-5 h-5" /></div>
                            <div className="overflow-hidden">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Teléfono</p>
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editData?.phone} 
                                  onChange={e => setEditData(prev => prev ? {...prev, phone: e.target.value} : null)}
                                  className="text-sm font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                                />
                              ) : (
                                <p className="text-sm font-bold text-foreground">{selectedFreelancer.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0"><DollarSign className="w-5 h-5" /></div>
                            <div className="overflow-hidden">
                              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Tarifa Hora</p>
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editData?.hourlyRate} 
                                  onChange={e => setEditData(prev => prev ? {...prev, hourlyRate: parseInt(e.target.value)} : null)}
                                  className="text-sm font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                                />
                              ) : (
                                <p className="text-sm font-bold text-foreground">€{selectedFreelancer.hourlyRate}/h</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Documentation */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <h4 className="text-[11px] font-outfit font-black text-indigo-500 uppercase tracking-[0.2em]">Documentación</h4>
                        </div>
                        <div className="space-y-2">
                          <button onClick={() => { setUploadType("invoice"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Añadir Factura</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => { setUploadType("budget"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Presupuesto</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => { setUploadType("contract"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Contrato</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "invoices" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-primary" />
                          <h4 className="text-[12px] font-outfit font-black text-primary uppercase tracking-[0.25em]">Facturación</h4>
                        </div>
                        <button 
                          onClick={() => { setUploadType("invoice"); fileInputRef.current?.click(); }}
                          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                        >
                          <Plus className="w-3 h-3" />
                          Añadir Factura
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><BarChart3 className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Pagado</p>
                            <p className="text-sm font-black text-foreground">€{invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Receipt className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Facturas Pagadas</p>
                            <p className="text-sm font-black text-foreground">{invoices.filter(i => i.status === 'paid').length}</p>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Zap className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Estado</p>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <p className="text-sm font-black text-foreground uppercase tracking-wider text-[10px]">Al día</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-secondary/20 border-b border-border">
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Factura</th>
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fecha</th>
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Monto</th>
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">PDF</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {invoices.map(invoice => (
                              <tr key={invoice.id} className="hover:bg-secondary/5 transition-colors">
                                <td className="px-6 py-4">
                                  {editingItemId === invoice.id ? (
                                    <button 
                                      onClick={() => { setUploadType("edit_invoice"); fileInputRef.current?.click(); }}
                                      className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg px-3 py-1.5 transition-all"
                                    >
                                      <Upload className="w-3 h-3 text-primary" />
                                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                        {itemEditData?.id || "Cambiar"}
                                      </span>
                                    </button>
                                  ) : (
                                    <span className="font-black text-[11px] text-foreground">{invoice.id}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {editingItemId === invoice.id ? (
                                    <input 
                                      type="date" 
                                      value={itemEditData?.date} 
                                      onChange={e => setItemEditData({...itemEditData, date: e.target.value})}
                                      className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[11px] w-full"
                                    />
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground">{invoice.date}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {editingItemId === invoice.id ? (
                                    <input 
                                      type="number" 
                                      value={itemEditData?.amount} 
                                      onChange={e => setItemEditData({...itemEditData, amount: parseInt(e.target.value) || 0})}
                                      className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[11px] font-black w-24"
                                    />
                                  ) : (
                                    <span className="font-black text-[11px] text-foreground">€{invoice.amount.toLocaleString()}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {editingItemId === invoice.id ? (
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => {
                                          setInvoices(prev => prev.map(inv => inv.id === editingItemId ? itemEditData : inv));
                                          setEditingItemId(null);
                                        }}
                                        className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-lg"
                                      >
                                        OK
                                      </button>
                                      <button 
                                        onClick={() => setEditingItemId(null)}
                                        className="px-3 py-1 bg-secondary text-foreground text-[9px] font-black uppercase rounded-lg"
                                      >
                                        X
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => {
                                        setEditingItemId(invoice.id);
                                        setItemEditData({...invoice});
                                      }}
                                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                    >
                                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "budgets" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          <h4 className="text-[12px] font-outfit font-black text-primary uppercase tracking-[0.25em]">Presupuestos</h4>
                        </div>
                        <button 
                          onClick={() => { setUploadType("budget"); fileInputRef.current?.click(); }}
                          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                        >
                          <Plus className="w-3 h-3" />
                          Añadir Presupuesto
                        </button>
                      </div>

                      {budgets.length > 0 ? (
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-secondary/20 border-b border-border">
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Presupuesto</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fecha</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Monto</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">PDF</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {budgets.map(budget => (
                                <tr key={budget.id} className="hover:bg-secondary/5 transition-colors">
                                  <td className="px-6 py-4">
                                    {editingItemId === budget.id ? (
                                      <button 
                                        onClick={() => { setUploadType("edit_budget"); fileInputRef.current?.click(); }}
                                        className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg px-3 py-1.5 transition-all"
                                      >
                                        <Upload className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                          {itemEditData?.title || "Cambiar"}
                                        </span>
                                      </button>
                                    ) : (
                                      <span className="font-black text-[11px] text-foreground">{budget.title}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {editingItemId === budget.id ? (
                                      <input 
                                        type="date" 
                                        value={itemEditData?.date} 
                                        onChange={e => setItemEditData({...itemEditData, date: e.target.value})}
                                        className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[11px] w-full"
                                      />
                                    ) : (
                                      <span className="text-[11px] text-muted-foreground">{budget.date}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {editingItemId === budget.id ? (
                                      <input 
                                        type="number" 
                                        value={itemEditData?.amount} 
                                        onChange={e => setItemEditData({...itemEditData, amount: parseInt(e.target.value) || 0})}
                                        className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[11px] font-black w-24"
                                      />
                                    ) : (
                                      <span className="font-black text-[11px] text-foreground">€{budget.amount.toLocaleString()}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {editingItemId === budget.id ? (
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => {
                                            setBudgets(prev => prev.map(b => b.id === editingItemId ? itemEditData : b));
                                            setEditingItemId(null);
                                          }}
                                          className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-lg"
                                        >
                                          OK
                                        </button>
                                        <button 
                                          onClick={() => setEditingItemId(null)}
                                          className="px-3 py-1 bg-secondary text-foreground text-[9px] font-black uppercase rounded-lg"
                                        >
                                          X
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          setEditingItemId(budget.id);
                                          setItemEditData({...budget});
                                        }}
                                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                      >
                                        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-6 bg-secondary/10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3">
                            <BarChart3 className="w-8 h-8 text-muted-foreground opacity-30" />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No hay presupuestos activos</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "contracts" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          <h4 className="text-[12px] font-outfit font-black text-primary uppercase tracking-[0.25em]">Contratos Vigentes</h4>
                        </div>
                        <button 
                          onClick={() => { setUploadType("contract"); fileInputRef.current?.click(); }}
                          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                        >
                          <Plus className="w-3 h-3" />
                          Añadir Contrato
                        </button>
                      </div>

                      {contracts.length > 0 ? (
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-secondary/20 border-b border-border">
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Contrato</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Fecha Firma</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Estado</th>
                                <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">PDF</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {contracts.map(contract => (
                                <tr key={contract.id} className="hover:bg-secondary/5 transition-colors">
                                  <td className="px-6 py-4">
                                    {editingItemId === contract.id ? (
                                      <button 
                                        onClick={() => { setUploadType("edit_contract"); fileInputRef.current?.click(); }}
                                        className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary border border-border rounded-lg px-3 py-1.5 transition-all"
                                      >
                                        <Upload className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                                          {itemEditData?.title || "Cambiar"}
                                        </span>
                                      </button>
                                    ) : (
                                      <span className="font-black text-[11px] text-foreground">{contract.title}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {editingItemId === contract.id ? (
                                      <input 
                                        type="date" 
                                        value={itemEditData?.signedDate} 
                                        onChange={e => setItemEditData({...itemEditData, signedDate: e.target.value})}
                                        className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[11px] w-full"
                                      />
                                    ) : (
                                      <span className="text-[11px] text-muted-foreground">{contract.signedDate}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {editingItemId === contract.id ? (
                                      <select 
                                        value={itemEditData?.status} 
                                        onChange={e => setItemEditData({...itemEditData, status: e.target.value})}
                                        className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest w-full"
                                      >
                                        <option value="active">Activo</option>
                                        <option value="pending">Pendiente</option>
                                        <option value="expired">Expirado</option>
                                      </select>
                                    ) : (
                                      <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        contract.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                      )}>
                                        {contract.status === "active" ? "Activo" : contract.status === "pending" ? "Pendiente" : "Expirado"}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {editingItemId === contract.id ? (
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => {
                                            setContracts(prev => prev.map(c => c.id === editingItemId ? itemEditData : c));
                                            setEditingItemId(null);
                                          }}
                                          className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-lg"
                                        >
                                          OK
                                        </button>
                                        <button 
                                          onClick={() => setEditingItemId(null)}
                                          className="px-3 py-1 bg-secondary text-foreground text-[9px] font-black uppercase rounded-lg"
                                        >
                                          X
                                        </button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          setEditingItemId(contract.id);
                                          setItemEditData({...contract});
                                        }}
                                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                      >
                                        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-6 bg-secondary/10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-muted-foreground opacity-30" />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No hay contratos registrados</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "skills" && (
                    <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-wrap gap-4">
                      {selectedFreelancer?.skills.map(skill => (
                        <div key={skill} className="px-6 py-4 bg-secondary/30 border border-border/50 rounded-2xl flex items-center gap-3"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-black uppercase tracking-widest">{skill}</span></div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-8 border-t border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-6"><div className="flex items-center gap-2 text-muted-foreground"><Building2 className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">{freelancerClients.length} Clientes atendidos</span></div></div>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                      <button onClick={handleSave} className="px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">Guardar Cambios</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setSelectedFreelancer(null)} className="px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cerrar</button>
                      <button onClick={handleEdit} className="px-8 py-3.5 rounded-2xl border border-primary text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">Editar Perfil</button>
                      <button className="px-8 py-3.5 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">Contactar<MessageSquare className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Freelancer Modal */}
      <AnimatePresence>
        {isAddingFreelancer && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingFreelancer(false)} className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-6 relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">Nuevo Freelancer</h2>
                  <p className="text-muted-foreground font-medium text-xs mt-1 opacity-60 uppercase tracking-widest">Añadir talento especializado</p>
                </div>
                <button onClick={() => setIsAddingFreelancer(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-10 pt-0 space-y-6 overflow-y-auto no-scrollbar max-h-[70vh]">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-4 py-4 border-b border-border/50">
                  <div className="relative group">
                    <input 
                      type="file" 
                      id="avatar-upload-freelancer"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setNewFreelancerData({...newFreelancerData, avatar: URL.createObjectURL(file)});
                      }}
                    />
                    <label 
                      htmlFor="avatar-upload-freelancer"
                      className="w-24 h-24 rounded-[2rem] bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-all border-2 border-dashed border-border group-hover:border-primary/40 overflow-hidden relative"
                    >
                      {newFreelancerData.avatar ? (
                        <img src={newFreelancerData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Avatar</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                    </label>
                  </div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Foto de Perfil (Opcional)</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Alex Rivera"
                      value={newFreelancerData.name}
                      onChange={e => setNewFreelancerData({...newFreelancerData, name: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Rol / Especialidad</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Senior Frontend Dev"
                      value={newFreelancerData.role}
                      onChange={e => setNewFreelancerData({...newFreelancerData, role: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Profesional</label>
                    <input 
                      type="email" 
                      placeholder="alex@rivera.dev"
                      value={newFreelancerData.email}
                      onChange={e => setNewFreelancerData({...newFreelancerData, email: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Teléfono de Contacto</label>
                    <input 
                      type="text" 
                      placeholder="+34 600 000 000"
                      value={newFreelancerData.phone}
                      onChange={e => setNewFreelancerData({...newFreelancerData, phone: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] ml-1">Tarifa Horaria (€)</label>
                    <input 
                      type="number" 
                      value={newFreelancerData.hourlyRate}
                      onChange={e => setNewFreelancerData({...newFreelancerData, hourlyRate: parseInt(e.target.value) || 0})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Valoración Inicial (1-5)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="1"
                      max="5"
                      value={newFreelancerData.rating}
                      onChange={e => setNewFreelancerData({...newFreelancerData, rating: parseFloat(e.target.value) || 5.0})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Habilidades (Separadas por comas)</label>
                  <input 
                    type="text" 
                    placeholder="React, Next.js, Tailwind..."
                    onChange={e => setNewFreelancerData({...newFreelancerData, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Factura</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="invoice-upload-new"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewFreelancerData({...newFreelancerData, invoice: file.name});
                        }}
                      />
                      <label 
                        htmlFor="invoice-upload-new"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newFreelancerData.invoice || "Subir Factura"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Presupuesto</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="budget-upload-new"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewFreelancerData({...newFreelancerData, budget: file.name});
                        }}
                      />
                      <label 
                        htmlFor="budget-upload-new"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newFreelancerData.budget || "Subir Presupuesto"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Contrato</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="contract-upload-new"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewFreelancerData({...newFreelancerData, contract: file.name});
                        }}
                      />
                      <label 
                        htmlFor="contract-upload-new"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newFreelancerData.contract || "Subir Contrato"}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={() => setIsAddingFreelancer(false)} className="flex-1 px-8 py-4 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                  <button onClick={handleAddFreelancer} className="flex-[1.5] px-8 py-4 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Registrar Freelancer</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
