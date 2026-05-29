"use client";

import { 
  KeyRound, 
  Plus, 
  Search, 
  Copy, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  X,
  MoreVertical,
  Folder,
  Shield,
  FileBadge,
  ExternalLink,
  Pencil,
  Trash,
  Key,
  LayoutGrid,
  Clock,
  Image as ImageIcon,
  Upload,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";

const initialFolders = [
  { id: "1", name: "Agencia", color: "bg-[#3b82f6]", count: 12 },
  { id: "2", name: "Software", color: "bg-[#10b981]", count: 8 },
];

const initialServices = [
  { id: "1", name: "Canva", user: "services@allenmax.com", pass: "••••••••••••", time: "HACE 3 DÍAS", iconColor: "text-blue-500", folderId: "1", extraFields: [], image: null },
  { id: "2", name: "Zoom", user: "services@allenmax.com", pass: "••••••••••••", time: "HACE 10 HORAS", iconColor: "text-sky-500", folderId: "1", extraFields: [], image: null },
  { id: "3", name: "Chat GPT", user: "services@allenmax.com", pass: "••••••••••••", time: "HACE 3 DÍAS", iconColor: "text-emerald-500", folderId: "1", extraFields: [], image: null },
  { id: "4", name: "Calendly", user: "services@allenmax.com", pass: "••••••••••••", time: "HACE 10 HORAS", iconColor: "text-slate-500", folderId: "1", extraFields: [], image: null },
  { id: "5", name: "n8n", user: "services@allenmax.com", pass: "••••••••••••", time: "HACE 1 DÍA", iconColor: "text-rose-500", folderId: "1", extraFields: [], image: null },
  { id: "6", name: "Gmail Agencia", user: "agency@allenmax.com", pass: "••••••••••••", time: "HACE 2 HORAS", iconColor: "text-red-500", folderId: "1", extraFields: [], image: null },
];

export default function VaultPage() {
  const [folders, setFolders] = useState(initialFolders);
  const [services, setServices] = useState(initialServices);
  const [selectedFolder, setSelectedFolder] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newExtraFields, setNewExtraFields] = useState<{label: string, value: string}[]>([]);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeFolder = folders.find(f => f.id === selectedFolder);
  
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = s.folderId === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [searchTerm, selectedFolder, services]);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    if (selectedService) {
      setEditData({ ...selectedService });
      setShowPass(false);
      setIsEditing(false);
    }
  }, [selectedService]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, forEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (forEdit) {
          setEditData({ ...editData, image: result });
        } else {
          setNewImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    setServices(prev => prev.map(s => s.id === editData.id ? editData : s));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setServices(prev => prev.filter(s => s.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    if (selectedServiceId === deleteConfirmId) setSelectedServiceId(null);
  };

  return (
    <div className="h-full flex flex-col gap-0 font-sans overflow-hidden px-0 pt-0 pb-0 relative bg-[#F8F9FB]">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => handleImageUpload(e, isEditing)} 
        accept="image/*" 
      />
      
      {/* Header Section */}
      <div className="px-10 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-[#1a1f2e]">Bóveda & Seguridad</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Almacenamiento seguro de credenciales y accesos corporativos.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar credencial..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-border/50 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium w-[340px] focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#1a1f2e] text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            + Nueva Credencial
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Folders Sidebar */}
        <div className="w-[320px] px-8 pt-6 pb-4 overflow-y-auto no-scrollbar shrink-0">
          <div className="bg-white/50 border border-border/40 rounded-[2.5rem] p-4 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4 px-4 mt-2">Carpetas</h2>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group",
                    selectedFolder === folder.id 
                      ? "bg-white text-primary shadow-md border border-primary/10" 
                      : "text-muted-foreground hover:bg-white/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", folder.color)} />
                    <span className="text-sm font-bold tracking-tight">{folder.name}</span>
                  </div>
                  <span className="text-[10px] font-black opacity-30">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedServiceId(service.id)}
                className={cn(
                  "group bg-white border border-border/50 rounded-[2rem] p-7 flex flex-col cursor-pointer transition-all duration-500 relative overflow-hidden",
                  selectedServiceId === service.id ? "ring-2 ring-primary/20 shadow-xl scale-[1.02]" : "hover:shadow-xl hover:-translate-y-1"
                )}
              >
                <div className="flex items-start justify-between mb-6 relative z-10">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                  ) : (
                    <div className={cn("w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center text-xl font-black", service.iconColor)}>
                      {service.name[0]}
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(service.id);
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-[#1a1f2e] tracking-tight">{service.name}</h3>
                  <p className="text-[13px] text-muted-foreground/60 font-medium mt-0.5 mb-6">{service.user}</p>
                </div>

                <div className="pt-5 border-t border-border/40 flex items-center justify-between mt-auto relative z-10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground/30" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{service.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedServiceId && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-white border-l border-border/40 flex flex-col shadow-2xl z-50"
          >
            <div className="p-10 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group/edit">
                  {editData?.image ? (
                    <img src={editData.image} alt={editData.name} className="w-12 h-12 rounded-2xl object-cover shadow-md" />
                  ) : (
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black bg-secondary/30", editData?.iconColor)}>
                      {editData?.name?.[0]}
                    </div>
                  )}
                  {isEditing && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-0 group-hover/edit:opacity-100 cursor-pointer transition-opacity"
                    >
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-xl font-black text-[#1a1f2e] bg-secondary/10 border border-border/40 rounded-xl px-3 py-1 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-black text-[#1a1f2e]">{editData?.name}</h2>
                )}
              </div>
              <button onClick={() => setSelectedServiceId(null)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-8">
               <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Usuario</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.user}
                      onChange={(e) => setEditData({...editData, user: e.target.value})}
                      className="w-full bg-secondary/10 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-between bg-secondary/20 rounded-2xl px-6 py-4 border border-border/40">
                       <span className="text-sm font-black text-[#1a1f2e]">{editData?.user}</span>
                       <Copy className="w-4 h-4 text-primary cursor-pointer hover:scale-110 transition-transform" onClick={() => navigator.clipboard.writeText(editData?.user)} />
                    </div>
                  )}
               </div>
               <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Contraseña</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.pass}
                      onChange={(e) => setEditData({...editData, pass: e.target.value})}
                      className="w-full bg-secondary/10 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-between bg-secondary/20 rounded-2xl px-6 py-4 border border-border/40">
                       <span className="text-sm font-black text-[#1a1f2e] tracking-widest">{showPass ? editData?.pass : "••••••••••••"}</span>
                       <div className="flex items-center gap-3">
                          {showPass ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground/60 cursor-pointer" onClick={() => setShowPass(false)} />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground/60 cursor-pointer" onClick={() => setShowPass(true)} />
                          )}
                          <Copy className="w-4 h-4 text-primary cursor-pointer" onClick={() => navigator.clipboard.writeText(editData?.pass)} />
                       </div>
                    </div>
                  )}
               </div>

               {/* Extra Fields Section in Sidebar */}
               <div className="space-y-4 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Campos Adicionales</label>
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => setEditData({...editData, extraFields: [...(editData.extraFields || []), { label: "", value: "" }]})}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Añadir
                      </button>
                    )}
                  </div>

                  {editData?.extraFields?.map((field: any, idx: number) => (
                    <div key={idx} className="space-y-2.5">
                       <div className="flex items-center justify-between px-1">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{field.label || "Sin Etiqueta"}</label>
                         {isEditing && (
                           <button 
                             onClick={() => {
                               const updated = editData.extraFields.filter((_: any, i: number) => i !== idx);
                               setEditData({...editData, extraFields: updated});
                             }}
                             className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                           >
                             Eliminar
                           </button>
                         )}
                       </div>

                       {isEditing ? (
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Nombre del campo"
                              value={field.label}
                              onChange={(e) => {
                                const updated = [...editData.extraFields];
                                updated[idx].label = e.target.value;
                                setEditData({...editData, extraFields: updated});
                              }}
                              className="flex-1 bg-secondary/10 border border-border/40 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Valor"
                              value={field.value}
                              onChange={(e) => {
                                const updated = [...editData.extraFields];
                                updated[idx].value = e.target.value;
                                setEditData({...editData, extraFields: updated});
                              }}
                              className="flex-[2] bg-secondary/10 border border-border/40 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none"
                            />
                         </div>
                       ) : (
                         <div className="flex items-center justify-between bg-secondary/20 rounded-2xl px-6 py-4 border border-border/40">
                            <span className="text-sm font-black text-[#1a1f2e]">{field.value}</span>
                            <Copy className="w-4 h-4 text-primary cursor-pointer hover:scale-110 transition-transform" onClick={() => navigator.clipboard.writeText(field.value)} />
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               <div className="pt-10 flex gap-4">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-2xl border border-border/60 text-[10px] font-black uppercase tracking-widest">Cancelar</button>
                      <button onClick={handleSaveEdit} className="flex-[2] py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Guardar Cambios</button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 py-4 rounded-2xl border border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Eliminar</button>
                      <button onClick={() => setIsEditing(true)} className="flex-[2] py-4 rounded-2xl bg-[#1a1f2e] text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">Editar Información</button>
                    </>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Credential Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-[#1a1f2e]/20 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.98 }} 
              className="relative w-full max-w-lg bg-white border border-border/40 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-12 py-10 border-b border-border/30 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-[#1a1f2e]">Nueva Credencial</h2>
                 <button onClick={() => { setShowModal(false); setNewExtraFields([]); setNewImage(null); }} className="p-2 hover:bg-secondary rounded-xl transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-12 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                 {/* Image Upload Zone */}
                 <div className="flex justify-center mb-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative w-24 h-24 rounded-[2rem] bg-secondary/10 border-2 border-dashed border-border/40 flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-secondary/20 transition-all overflow-hidden"
                    >
                      {newImage ? (
                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                          <Upload className="w-5 h-5" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Foto</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Servicio</label>
                    <input type="text" placeholder="Ej. Canva" className="w-full bg-secondary/10 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Usuario</label>
                       <input type="text" placeholder="user@email.com" className="w-full bg-secondary/10 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none" />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Contraseña</label>
                       <input type="password" placeholder="••••••••" className="w-full bg-secondary/10 border border-border/40 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none" />
                    </div>
                 </div>

                 {/* Extra Fields Section */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Campos Adicionales</label>
                      <button 
                        type="button"
                        onClick={() => setNewExtraFields([...newExtraFields, { label: "", value: "" }])}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/40 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-secondary transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir Campo
                      </button>
                    </div>
                    
                    {newExtraFields.map((field, idx) => (
                      <div key={idx} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex-1 space-y-2.5">
                          <input 
                            type="text" 
                            placeholder="Etiqueta (Ej. Teléfono)" 
                            value={field.label}
                            onChange={(e) => {
                              const updated = [...newExtraFields];
                              updated[idx].label = e.target.value;
                              setNewExtraFields(updated);
                            }}
                            className="w-full bg-secondary/5 border border-border/40 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none" 
                          />
                        </div>
                        <div className="flex-[2] space-y-2.5">
                          <input 
                            type="text" 
                            placeholder="Valor" 
                            value={field.value}
                            onChange={(e) => {
                              const updated = [...newExtraFields];
                              updated[idx].value = e.target.value;
                              setNewExtraFields(updated);
                            }}
                            className="w-full bg-secondary/5 border border-border/40 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none" 
                          />
                        </div>
                        <button 
                          onClick={() => setNewExtraFields(newExtraFields.filter((_, i) => i !== idx))}
                          className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all mb-0.5"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button onClick={() => { setShowModal(false); setNewExtraFields([]); setNewImage(null); }} className="flex-1 py-4 rounded-2xl border border-border/60 text-[10px] font-black uppercase tracking-widest">Cancelar</button>
                    <button className="flex-[2] py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Guardar Credencial</button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-[#1a1f2e]/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white border border-border/40 rounded-[3rem] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-xl font-black text-[#1a1f2e] mb-3">¿Eliminar Credencial?</h2>
              <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">Esta acción es permanente y no se podrá recuperar el acceso.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Cancelar</button>
                <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all">Eliminar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}