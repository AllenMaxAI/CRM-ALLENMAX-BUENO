"use client";

import { 
  FileText, 
  Plus, 
  Search, 
  Folder, 
  File, 
  MoreVertical, 
  Clock, 
  HardDrive, 
  X, 
  Check, 
  ArrowUpCircle,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

const initialFiles = [
  { id: "1", name: "Propuesta Comercial v2.pdf", type: "pdf", size: "2.4 MB", date: "Hoy, 12:00", folderId: "1", url: "https://example.com/propuesta.pdf" },
  { id: "2", name: "Contrato Colaboración.docx", type: "doc", size: "1.1 MB", date: "Ayer, 09:15", folderId: "2", url: "https://example.com/contrato.docx" },
  { id: "3", name: "Captura Pipeline.png", type: "img", size: "4.5 MB", date: "22 Abr", folderId: "1", url: "https://example.com/captura.png" },
  { id: "4", name: "Estructura Base de Datos.sql", type: "code", size: "12 KB", date: "20 Abr", folderId: "3", url: "https://example.com/db.sql" },
  { id: "5", name: "Balance Trimestral Q1.xlsx", type: "sheet", size: "850 KB", date: "15 Abr", folderId: "2", url: "https://example.com/balance.xlsx" },
];

const initialFolders = [
  { id: "1", name: "Proyectos Activos", count: 2 },
  { id: "2", name: "Facturas y Legal", count: 2 },
  { id: "3", name: "Recursos IA", count: 1 },
  { id: "4", name: "Freelancers", count: 0 },
];

export default function DocumentsPage() {
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFile, setEditingFile] = useState<{ id: string, name: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState({ show: false, message: "" });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeFileMenu, setActiveFileMenu] = useState<string | null>(null);

  const filteredFolders = useMemo(() => {
    return folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [folders, searchTerm]);

  const currentFolder = folders.find(f => f.id === selectedFolderId);
  const folderFiles = files.filter(f => f.folderId === selectedFolderId);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (folders.length + 1).toString();
    setFolders([{ id: newId, name: newFolderName, count: 0 }, ...folders]);
    setShowFolderModal(false);
    setNewFolderName("");
    triggerSuccess("Carpeta creada correctamente");
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolderId) return;
    
    const newFile = {
      id: (files.length + 1).toString(),
      name: "Nuevo Archivo.pdf",
      type: "pdf",
      size: "0.5 MB",
      date: "Ahora",
      folderId: selectedFolderId,
      url: "#"
    };
    
    setFiles([newFile, ...files]);
    setFolders(folders.map(f => f.id === selectedFolderId ? { ...f, count: f.count + 1 } : f));
    setShowUploadModal(false);
    triggerSuccess("Archivo subido correctamente");
  };

  const handleEditFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;
    setFiles(files.map(f => f.id === editingFile.id ? { ...f, name: editingFile.name } : f));
    setShowEditModal(false);
    setEditingFile(null);
    triggerSuccess("Archivo actualizado");
  };

  const handleDeleteFile = (id: string) => {
    const fileToDelete = files.find(f => f.id === id);
    if (fileToDelete) {
      setFiles(files.filter(f => f.id !== id));
      setFolders(folders.map(f => f.id === fileToDelete.folderId ? { ...f, count: Math.max(0, f.count - 1) } : f));
      triggerSuccess("Archivo eliminado");
    }
    setActiveFileMenu(null);
  };
  const triggerSuccess = (message: string) => {
    setShowSuccess({ show: true, message });
    setTimeout(() => setShowSuccess({ show: false, message: "" }), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFolderId) return;

    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.split("/")[1] || "file",
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      date: "Ahora",
      folderId: selectedFolderId,
      url: URL.createObjectURL(file)
    };

    setFiles([newFile, ...files]);
    setFolders(folders.map(f => f.id === selectedFolderId ? { ...f, count: f.count + 1 } : f));
    setShowUploadModal(false);
    triggerSuccess("Archivo subido correctamente");
  };

  return (
    <div className="h-full flex flex-col gap-8 font-sans overflow-hidden px-10 pt-10 pb-10 relative">
      {/* Hidden File Input */}
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {showSuccess.show && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 right-8 z-[100] flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 font-bold" >
            <Check className="w-5 h-5" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">{selectedFolderId ? currentFolder?.name : "Gestor de Documentos"}</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">{selectedFolderId ? `Gestionando documentos en ${currentFolder?.name}` : "Almacenamiento centralizado de documentos y recursos técnicos."}</p>
        </div>
        <div className="flex items-center gap-4">
          {selectedFolderId && (
            <button 
              onClick={() => setSelectedFolderId(null)}
              className="flex items-center gap-2 bg-secondary/50 text-foreground px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 border border-border"
            >
              <ArrowUpCircle className="w-4 h-4 rotate-[270deg]" />
              <span>Volver</span>
            </button>
          )}
          <button 
            disabled={!selectedFolderId}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={cn(
              "flex items-center gap-2.5 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg",
              selectedFolderId 
                ? "bg-secondary border border-border text-foreground hover:bg-background" 
                : "bg-secondary/20 text-muted-foreground border-dashed border-border cursor-not-allowed"
            )}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Subir Archivo</span>
          </button>
          <button 
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Carpeta</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={selectedFolderId ? "Buscar en esta carpeta..." : "Buscar carpetas o archivos generales..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <AnimatePresence mode="wait">
          {!selectedFolderId ? (
            <motion.div 
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredFolders.map((folder) => (
                <motion.div 
                  layout
                  key={folder.id} 
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="p-8 rounded-[3rem] bg-card border border-border shadow-sm hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    <Folder className="w-8 h-8 fill-primary/10" />
                  </div>
                  <h3 className="font-black text-lg text-foreground mb-1 group-hover:text-primary transition-colors tracking-tight">{folder.name}</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">{folder.count} elementos</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {folderFiles.length > 0 ? (
                <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border">
                        <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Documento</th>
                        <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Tamaño</th>
                        <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Última Edición</th>
                        <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {folderFiles.map((file) => (
                        <tr key={file.id} className="group hover:bg-secondary/20 transition-all">
                          <td className="px-10 py-7">
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-5 group/item"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover/item:text-primary transition-all border border-border/50 group-hover/item:scale-105 shadow-inner">
                                <FileText className="w-6 h-6" />
                              </div>
                              <span className="font-black text-sm text-foreground group-hover/item:text-primary transition-colors tracking-tight border-b-2 border-transparent group-hover/item:border-primary/20 pb-0.5">
                                {file.name}
                              </span>
                            </a>
                          </td>
                          <td className="px-10 py-7">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-secondary/50 px-3 py-1.5 rounded-xl border border-border/50">
                              {file.size}
                            </span>
                          </td>
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-70">
                              <Clock className="w-3.5 h-3.5" />
                              {file.date}
                            </div>
                          </td>
                          <td className="px-10 py-7 text-right relative">
                            <button 
                              onClick={() => setActiveFileMenu(activeFileMenu === file.id ? null : file.id)}
                              className="p-3 hover:bg-secondary rounded-2xl transition-all text-muted-foreground hover:text-foreground active:scale-90 border border-transparent hover:border-border shadow-sm"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            <AnimatePresence>
                              {activeFileMenu === file.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setActiveFileMenu(null)} />
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-10 top-20 w-48 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-2"
                                  >
                                    <button 
                                      onClick={() => {
                                        setEditingFile({ id: file.id, name: file.name });
                                        setShowEditModal(true);
                                        setActiveFileMenu(null);
                                      }}
                                      className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-foreground hover:bg-secondary rounded-xl transition-colors"
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteFile(file.id)}
                                      className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                                    >
                                      Eliminar
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-40 text-center border-4 border-dashed border-border/50 rounded-[4rem] bg-secondary/5">
                  <div className="w-24 h-24 bg-secondary/50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <File className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Carpeta Vacía</h3>
                  <p className="text-[10px] font-bold text-muted-foreground mt-4 uppercase opacity-30">Despliega tu primer recurso en este sector.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showFolderModal || showUploadModal || showEditModal) && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowFolderModal(false); setShowUploadModal(false); setShowEditModal(false); }} className="absolute inset-0 bg-white/5 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden p-10" >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">
                    {showFolderModal ? "Crear Carpeta" : showEditModal ? "Editar Recurso" : "Subir Recurso"}
                  </h2>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-50">
                    {showFolderModal ? "Estructura tu ecosistema de archivos" : showEditModal ? `Modificando ${editingFile?.name}` : `Añadir archivo a ${currentFolder?.name}`}
                  </p>
                </div>
                <button onClick={() => { setShowFolderModal(false); setShowUploadModal(false); setShowEditModal(false); }} className="p-3 hover:bg-secondary rounded-2xl transition-colors active:scale-90"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={showFolderModal ? handleAddFolder : showEditModal ? handleEditFile : (e) => { e.preventDefault(); document.getElementById("fileInput")?.click(); }} className="space-y-8">
                {showFolderModal ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Nombre de la Carpeta</label>
                    <input required autoFocus type="text" placeholder="Ej. Proyectos Estratégicos" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-tight" />
                  </div>
                ) : showEditModal ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Nuevo Nombre del Archivo</label>
                      <input required autoFocus type="text" value={editingFile?.name} onChange={e => setEditingFile(prev => prev ? { ...prev, name: e.target.value } : null)} className="w-full bg-secondary/20 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-tight" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] px-1">Sustituir Documento (Opcional)</label>
                      <div 
                        onClick={() => document.getElementById("fileInput")?.click()}
                        className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:bg-secondary/20 transition-all cursor-pointer"
                      >
                        <ArrowUpCircle className="w-8 h-8 text-primary mx-auto mb-2 opacity-40" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Nueva Versión</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="border-4 border-dashed border-border/50 rounded-[2.5rem] p-12 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <ArrowUpCircle className="w-16 h-16 text-primary mx-auto mb-6 opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110" />
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Arrastra tus archivos aquí</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase opacity-50">O haz clic para seleccionar</p>
                  </div>
                )}
                
                <div className="pt-6">
                  <button type="submit" className="w-full bg-foreground text-background py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    {showFolderModal ? "Desplegar Carpeta" : showEditModal ? "Guardar Cambios" : "Cargar Documento"}
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
