"use client";

import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  ChevronRight,
  FileText,
  Calendar,
  Zap,
  DollarSign,
  Briefcase,
  ExternalLink,
  Clock,
  ChevronLeft,
  ArrowRight,
  Receipt,
  ShieldCheck,
  BarChart3,
  Globe,
  Settings,
  X,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import { MOCK_CLIENTS, MOCK_PROJECTS, MOCK_FREELANCERS, MOCK_INVOICES, MOCK_CONTRACTS } from "@/lib/mock-data";
import { Client, Invoice, Contract } from "@/types";

import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 8;

export default function ClientsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"info" | "projects" | "invoices" | "contracts" | "budgets">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [uploadType, setUploadType] = useState<"invoice" | "budget" | "contract" | "profile" | "edit_invoice" | "edit_budget" | "edit_contract" | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemEditData, setItemEditData] = useState<any>(null);
  const [newClientData, setNewClientData] = useState({
    name: "", // Empresa
    contactName: "", // Persona
    industry: "",
    email: "",
    phone: "",
    nif: "",
    status: "activo" as const,
    monthlyPayment: 0,
    initialPayment: 0,
    permanence: 12,
    onlyInitial: false,
    invoice: "",
    budget: "",
    contract: "",
    avatar: "",
    createdAt: new Date().toISOString().split('T')[0]
  });

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const currentClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const clientProjects = useMemo(() => {
    if (!selectedClient) return [];
    return MOCK_PROJECTS.filter(p => p.clientId === selectedClient.id);
  }, [selectedClient]);

  const clientFreelancers = useMemo(() => {
    if (!selectedClient) return [];
    const fIds = new Set(clientProjects.flatMap(p => p.freelancerIds));
    return MOCK_FREELANCERS.filter(f => fIds.has(f.id));
  }, [selectedClient, clientProjects]);

  const clientInvoices = useMemo(() => {
    if (!selectedClient) return [];
    return invoices.filter(i => i.clientId === selectedClient.id);
  }, [selectedClient, invoices]);

  const clientContracts = useMemo(() => {
    if (!selectedClient) return [];
    return contracts.filter(c => c.clientId === selectedClient.id);
  }, [selectedClient, contracts]);

  const clientBudgets = useMemo(() => {
    if (!selectedClient) return [];
    return budgets.filter(b => b.clientId === selectedClient.id);
  }, [selectedClient, budgets]);

  const handleEdit = () => {
    setEditData(selectedClient);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      setClients(prev => prev.map(c => c.id === editData.id ? editData : c));
      setSelectedClient(editData);
      setIsEditing(false);
    }
  };

  const handleAddClient = () => {
    const client: Client = {
      id: `c-${Date.now()}`,
      ...newClientData
    };
    setClients([client, ...clients]);
    setIsAddingClient(false);
    setNewClientData({
      name: "",
      contactName: "",
      industry: "",
      email: "",
      phone: "",
      nif: "",
      status: "activo",
      monthlyPayment: 0,
      initialPayment: 0,
      permanence: 12,
      onlyInitial: false,
      invoice: "",
      budget: "",
      contract: "",
      avatar: "",
      createdAt: new Date().toISOString().split('T')[0]
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
          if (!file || !selectedClient) return;

          if (uploadType === "invoice") {
            const newInv: Invoice = {
              id: `INV-${Date.now()}`,
              clientId: selectedClient.id,
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
              clientId: selectedClient.id,
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
              clientId: selectedClient.id,
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
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Directorio de Clientes</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Gestión de relaciones y ecosistema de partners.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-72 shadow-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setIsAddingClient(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {currentClients.map((client, idx) => (
            <motion.div
              layout
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedClient(client);
                setActiveTab("info");
              }}
              className="group bg-card border border-border hover:border-primary/30 rounded-[2.5rem] p-6 cursor-pointer transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden"
            >
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-6 relative">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground/30 font-black text-xl shadow-inner border border-border group-hover:scale-110 transition-transform duration-500">
                  {client.name[0]}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  client.status === "activo" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                )}>
                  {client.status}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-outfit font-black text-xl text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{client.industry}</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5 opacity-50" />
                  <span className="text-[11px] font-bold truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5 opacity-50 text-emerald-500" />
                  <span className="text-[11px] font-black text-foreground">
                    {client.onlyInitial ? `€${client.initialPayment.toLocaleString()}` : `€${client.monthlyPayment.toLocaleString()}/m`}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                      U{i}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="text-[10px] font-black uppercase tracking-widest">Gestionar</span>
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
        {selectedClient && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedClient(null); setIsEditing(false); }} className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            
<motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                className="relative w-full max-w-5xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[85vh]"
              >
              {/* Modal Header */}
              <div className="p-8 md:p-12 pb-0 relative">
                <div className="absolute top-8 right-8 flex items-center gap-4">
                  <button onClick={() => { setSelectedClient(null); setIsEditing(false); }} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer" onClick={() => { setUploadType("profile"); fileInputRef.current?.click(); }}>
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/20 overflow-hidden">
                      {selectedClient.name[0]}
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
                        <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">{selectedClient.name}</h2>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                          Cuenta VIP
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editData?.industry} 
                            onChange={e => setEditData(prev => prev ? {...prev, industry: e.target.value} : null)}
                            className="text-[10px] font-bold uppercase tracking-widest bg-secondary/30 border border-border rounded-lg px-2 py-0.5 focus:outline-none"
                          />
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-widest">{selectedClient.industry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 border-b border-border">
                  {[
                    { id: 'info', label: 'Información', icon: Building2 },
                    { id: 'projects', label: 'Proyectos', icon: Briefcase },
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
                  {activeTab === "info" && (
                    <motion.div 
                      key="info"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      {/* Column 1: Administrative */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-primary" />
                          <h4 className="text-[11px] font-outfit font-black text-primary uppercase tracking-[0.2em]">Administración</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Contacto Principal</p>
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editData?.contactName} 
                                onChange={e => setEditData(prev => prev ? {...prev, contactName: e.target.value} : null)}
                                className="text-sm font-black bg-transparent border-none p-0 focus:ring-0 w-full"
                              />
                            ) : (
                              <p className="text-sm font-black text-foreground">{selectedClient.contactName}</p>
                            )}
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">NIF / CIF</p>
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editData?.nif} 
                                onChange={e => setEditData(prev => prev ? {...prev, nif: e.target.value} : null)}
                                className="text-sm font-black bg-transparent border-none p-0 focus:ring-0 w-full"
                              />
                            ) : (
                              <p className="text-sm font-black text-foreground">{selectedClient.nif}</p>
                            )}
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Email Corporativo</p>
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editData?.email} 
                                onChange={e => setEditData(prev => prev ? {...prev, email: e.target.value} : null)}
                                className="text-sm font-black bg-transparent border-none p-0 focus:ring-0 w-full"
                              />
                            ) : (
                              <p className="text-sm font-black text-foreground truncate">{selectedClient.email}</p>
                            )}
                          </div>
                          <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Teléfono</p>
                            {isEditing ? (
                              <input 
                                type="text" 
                                value={editData?.phone} 
                                onChange={e => setEditData(prev => prev ? {...prev, phone: e.target.value} : null)}
                                className="text-sm font-black bg-transparent border-none p-0 focus:ring-0 w-full"
                              />
                            ) : (
                              <p className="text-sm font-black text-foreground">{selectedClient.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Financial */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-[11px] font-outfit font-black text-emerald-500 uppercase tracking-[0.2em]">Pagos y Plan</h4>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-[2rem] text-white shadow-xl shadow-emerald-500/10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest">Premium</div>
                            <Receipt className="w-5 h-5 opacity-40" />
                          </div>
                          <div className="space-y-1 mb-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Mensualidad</p>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editData?.monthlyPayment} 
                                onChange={e => setEditData(prev => prev ? {...prev, monthlyPayment: parseInt(e.target.value)} : null)}
                                className="text-3xl font-outfit font-black bg-white/10 border-none p-1 rounded-lg focus:ring-0 w-full appearance-none"
                              />
                            ) : (
                              <p className="text-3xl font-outfit font-black tracking-tighter">€{selectedClient.monthlyPayment.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="space-y-3 pt-4 border-t border-white/20">
                            <div className="flex justify-between items-center">
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Permanencia</p>
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editData?.permanence} 
                                  onChange={e => setEditData(prev => prev ? {...prev, permanence: parseInt(e.target.value)} : null)}
                                  className="text-xs font-black bg-white/10 border-none p-0.5 rounded-md focus:ring-0 w-12 text-right appearance-none"
                                />
                              ) : (
                                <p className="text-xs font-black">{selectedClient.permanence}m</p>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Setup Fee</p>
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editData?.initialPayment} 
                                  onChange={e => setEditData(prev => prev ? {...prev, initialPayment: parseInt(e.target.value)} : null)}
                                  className="text-xs font-black bg-white/10 border-none p-0.5 rounded-md focus:ring-0 w-16 text-right appearance-none"
                                />
                              ) : (
                                <p className="text-xs font-black">€{selectedClient.initialPayment.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Antigüedad</p>
                            <p className="text-sm font-black">
                              {(() => {
                                const created = new Date(selectedClient.createdAt);
                                const now = new Date();
                                const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
                                return `${months === 0 ? 'Reciente' : `${months} meses`}`;
                              })()}
                            </p>
                          </div>
                          <Calendar className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                      </div>

                      {/* Column 3: Documentation */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <h4 className="text-[11px] font-outfit font-black text-indigo-500 uppercase tracking-[0.2em]">Documentación</h4>
                        </div>
                        <div className="space-y-3">
                          <button onClick={() => { setUploadType("invoice"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-foreground/70">Añadir Factura</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => { setUploadType("budget"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-foreground/70">Presupuesto</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => { setUploadType("contract"); fileInputRef.current?.click(); }} className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all group shadow-sm text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plus className="w-4 h-4" /></div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-foreground/70">Contrato</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "projects" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <h4 className="text-[12px] font-outfit font-black text-primary uppercase tracking-[0.25em]">Historial de Proyectos</h4>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{clientProjects.length} proyectos</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clientProjects.map(project => (
                          <div key={project.id} className="bg-card border border-border p-6 rounded-[2rem] hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                              <div className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                project.status === "completado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                              )}>
                                {project.status.replace('_', ' ')}
                              </div>
                              <p className="text-sm font-black text-foreground">€{project.budget.toLocaleString()}</p>
                            </div>
                            <h5 className="font-black text-base mb-3 truncate group-hover:text-primary transition-colors">{project.name}</h5>
                            
                            <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Progreso</p>
                                  <p className="text-[10px] font-black text-foreground">{project.progress}%</p>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${project.progress}%` }} 
                                    className="h-full bg-primary" 
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex -space-x-2">
                                  {project.freelancerIds.slice(0, 3).map(fid => {
                                    const f = MOCK_FREELANCERS.find(fl => fl.id === fid);
                                    return (
                                      <div key={fid} title={f?.name} className="w-7 h-7 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-[9px] font-bold shadow-sm">
                                        {f?.name[0]}
                                      </div>
                                    );
                                  })}
                                  {project.freelancerIds.length > 3 && (
                                    <div className="w-7 h-7 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-[8px] font-black text-muted-foreground shadow-sm">
                                      +{project.freelancerIds.length - 3}
                                    </div>
                                  )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all group-hover:text-primary" />
                              </div>
                            </div>
                          </div>
                        ))}
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
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Inversión Total</p>
                            <p className="text-lg font-black text-foreground">€{(clientInvoices.reduce((acc, inv) => acc + inv.amount, 0)).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Receipt className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Facturas Pagadas</p>
                            <p className="text-lg font-black text-foreground">{clientInvoices.filter(i => i.status === "paid").length}</p>
                          </div>
                        </div>
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><ShieldCheck className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Estado</p>
                            <p className="text-lg font-black text-foreground">Al Día</p>
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
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Estado</th>
                              <th className="px-6 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">PDF</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {clientInvoices.map(invoice => (
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
                                <td className="px-6 py-4">
                                  {editingItemId === invoice.id ? (
                                    <select 
                                      value={itemEditData?.status} 
                                      onChange={e => setItemEditData({...itemEditData, status: e.target.value})}
                                      className="bg-secondary/30 border border-border rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest w-full"
                                    >
                                      <option value="paid">Pagada</option>
                                      <option value="pending">Pendiente</option>
                                    </select>
                                  ) : (
                                    <span className={cn(
                                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                      invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                    )}>
                                      {invoice.status === "paid" ? "Pagada" : "Pendiente"}
                                    </span>
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
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
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

                       {clientBudgets.length > 0 ? (
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
                                {clientBudgets.map(budget => (
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
                         <div className="bg-secondary/20 p-10 rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
                            <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
                            <div>
                               <h5 className="font-outfit font-black text-lg text-foreground">Sin presupuestos activos</h5>
                               <p className="text-xs text-muted-foreground mt-1 max-w-xs">Genera un nuevo presupuesto operativo para este cliente y envíalo para aprobación.</p>
                            </div>
                            <button 
                              onClick={() => { setUploadType("budget"); fileInputRef.current?.click(); }}
                              className="mt-4 px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                            >
                              Añadir Presupuesto
                            </button>
                         </div>
                       )}
                    </motion.div>
                  )}

                  {activeTab === "contracts" && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
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

                      {clientContracts.length > 0 ? (
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
                              {clientContracts.map(contract => (
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
                        <div className="bg-secondary/20 p-10 rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
                           <ShieldCheck className="w-12 h-12 text-muted-foreground opacity-20" />
                           <div>
                              <h5 className="font-outfit font-black text-lg text-foreground">Sin contratos registrados</h5>
                              <p className="text-xs text-muted-foreground mt-1 max-w-xs">Sube el acuerdo legal firmado para formalizar la relación con este cliente.</p>
                           </div>
                           <button 
                             onClick={() => { setUploadType("contract"); fileInputRef.current?.click(); }}
                             className="mt-4 px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                           >
                             Añadir Contrato
                           </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex -space-x-3">
                    {clientFreelancers.map(f => (
                      <div key={f.id} title={f.name} className="w-10 h-10 rounded-xl bg-card border-2 border-background flex items-center justify-center text-xs font-black shadow-sm">
                        {f.name[0]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">{clientFreelancers.length} Freelancers asignados</p>
                </div>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                      <button onClick={handleSave} className="px-8 py-3.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">Guardar Cambios</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setSelectedClient(null)} className="px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cerrar</button>
                      <button onClick={handleEdit} className="px-8 py-3.5 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                        Editar Cuenta
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddingClient && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingClient(false)} className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-6 relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground">Añadir Cliente</h2>
                  <p className="text-muted-foreground font-medium text-xs mt-1 opacity-60 uppercase tracking-widest">Nueva entrada en el directorio</p>
                </div>
                <button onClick={() => setIsAddingClient(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-10 pt-0 space-y-6 overflow-y-auto no-scrollbar max-h-[70vh]">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center gap-4 py-4 border-b border-border/50">
                  <div className="relative group">
                    <input 
                      type="file" 
                      id="avatar-upload-new"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setNewClientData({...newClientData, avatar: URL.createObjectURL(file)});
                      }}
                    />
                    <label 
                      htmlFor="avatar-upload-new"
                      className="w-24 h-24 rounded-[2rem] bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-all border-2 border-dashed border-border group-hover:border-primary/40 overflow-hidden relative"
                    >
                      {newClientData.avatar ? (
                        <img src={newClientData.avatar} alt="Preview" className="w-full h-full object-cover" />
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
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Nombre de la Empresa</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Acme Dynamics SL"
                      value={newClientData.name}
                      onChange={e => setNewClientData({...newClientData, name: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Nombre del Cliente (Contacto)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Juan Pérez"
                      value={newClientData.contactName}
                      onChange={e => setNewClientData({...newClientData, contactName: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Email del Cliente</label>
                    <input 
                      type="email" 
                      placeholder="juan@empresa.com"
                      value={newClientData.email}
                      onChange={e => setNewClientData({...newClientData, email: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Teléfono del Cliente</label>
                    <input 
                      type="text" 
                      placeholder="+34 600 000 000"
                      value={newClientData.phone}
                      onChange={e => setNewClientData({...newClientData, phone: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">CIF / NIF</label>
                    <input 
                      type="text" 
                      placeholder="B12345678"
                      value={newClientData.nif}
                      onChange={e => setNewClientData({...newClientData, nif: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Industria / Sector</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Retail / E-commerce"
                      value={newClientData.industry}
                      onChange={e => setNewClientData({...newClientData, industry: e.target.value})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Setup Inicial (€)</label>
                    <input 
                      type="number" 
                      value={newClientData.initialPayment}
                      onChange={e => setNewClientData({...newClientData, initialPayment: parseInt(e.target.value) || 0})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Permanencia (Meses)</label>
                    <input 
                      type="number" 
                      value={newClientData.permanence}
                      onChange={e => setNewClientData({...newClientData, permanence: parseInt(e.target.value) || 0})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Mensualidad (€)</label>
                    <input 
                      type="number" 
                      value={newClientData.monthlyPayment}
                      onChange={e => setNewClientData({...newClientData, monthlyPayment: parseInt(e.target.value) || 0})}
                      className="w-full bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Factura</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="invoice-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewClientData({...newClientData, invoice: file.name});
                        }}
                      />
                      <label 
                        htmlFor="invoice-upload"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newClientData.invoice || "Subir Factura"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Presupuesto</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="budget-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewClientData({...newClientData, budget: file.name});
                        }}
                      />
                      <label 
                        htmlFor="budget-upload"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newClientData.budget || "Subir Presupuesto"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Contrato</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="contract-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewClientData({...newClientData, contract: file.name});
                        }}
                      />
                      <label 
                        htmlFor="contract-upload"
                        className="w-full bg-secondary/20 border-2 border-dashed border-border/50 rounded-2xl px-4 py-4 text-[10px] font-bold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 hover:border-primary/30 transition-all text-muted-foreground group-hover:text-primary min-h-[90px] text-center"
                      >
                        <Upload className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate max-w-full px-2">{newClientData.contract || "Subir Contrato"}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={() => setIsAddingClient(false)} className="flex-1 px-8 py-4 rounded-2xl border border-border bg-card text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                  <button onClick={handleAddClient} className="flex-[1.5] px-8 py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">Registrar Cliente</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
