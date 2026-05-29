"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Wallet,
  ArrowRightLeft,
  X,
  Save,
  Check,
  ChevronDown,
  Trash2,
  Info,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  LayoutGrid,
  Hash,
  DollarSign,
  Paperclip,
  Upload,
  CalendarDays,
  Activity,
  Zap,
  CreditCard,
  Server,
  Megaphone,
  Briefcase,
  Settings2,
  Edit2,
  AlertTriangle,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Building2 } from "lucide-react";

// --- CUSTOM DATE PICKER COMPONENT ---
function CustomDatePicker({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(value || now));
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = useMemo(() => {
    const d = [];
    for (let i = 0; i < adjustedFirstDay; i++) d.push(null);
    for (let i = 1; i <= daysInMonth; i++) d.push(i);
    return d;
  }, [viewDate, daysInMonth, adjustedFirstDay]);

  // Year grid: current year ±7
  const currentYear = viewDate.getFullYear();
  const years = useMemo(() => {
    const arr = [];
    for (let y = currentYear - 6; y <= currentYear + 6; y++) arr.push(y);
    return arr;
  }, [currentYear]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(selected.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
      >
        <span className={cn("text-[10px] font-outfit font-black uppercase tracking-widest", !value && "opacity-30")}>
          {value || placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[500] top-full mt-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] p-6 min-w-[280px]"
          >
            {showYearPicker ? (
              /* ── Year picker grid ── */
              <>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setShowYearPicker(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Mes
                  </button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Seleccionar año</p>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => {
                        const nd = new Date(viewDate);
                        nd.setFullYear(y);
                        setViewDate(nd);
                        setShowYearPicker(false);
                      }}
                      className={cn(
                        "py-2 rounded-xl text-[11px] font-black transition-all",
                        y === currentYear ? "bg-foreground text-background shadow-md" : "hover:bg-secondary text-foreground/70"
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* ── Month/day view ── */
              <>
                <div className="flex items-center justify-between mb-6">
                  <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1))); }} className="p-1.5 hover:bg-secondary rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{monthNames[viewDate.getMonth()]}</p>
                    <button
                      onClick={() => setShowYearPicker(true)}
                      className="text-[9px] font-bold text-primary hover:underline transition-colors"
                    >
                      {viewDate.getFullYear()}
                    </button>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1))); }} className="p-1.5 hover:bg-secondary rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["L", "M", "X", "J", "V", "S", "D"].map(d => <span key={d} className="text-[8px] font-black text-muted-foreground text-center opacity-30">{d}</span>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => (
                    <button
                      key={i}
                      disabled={!day}
                      onClick={() => day && handleDateClick(day)}
                      className={cn(
                        "w-8 h-8 rounded-xl text-[10px] font-black flex items-center justify-center transition-all",
                        !day ? "opacity-0 cursor-default" : "hover:bg-primary hover:text-white",
                        value && day === new Date(value).getDate() && viewDate.getMonth() === new Date(value).getMonth() ? "bg-foreground text-background shadow-md" : "text-foreground/70"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                   <button onClick={() => { onChange(""); setIsOpen(false); }} className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:underline">Borrar</button>
                   <button onClick={() => { onChange(new Date().toISOString().split('T')[0]); setIsOpen(false); }} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Hoy</button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN PAGE ---

const initialCategories = [
  { id: "1", name: "Servicios IA", color: "bg-blue-500", icon: Zap },
  { id: "2", name: "Suscripciones", color: "bg-violet-500", icon: CreditCard },
  { id: "3", name: "Infraestructura Cloud", color: "bg-rose-500", icon: Server },
  { id: "4", name: "Publicidad", color: "bg-amber-500", icon: Megaphone },
];

const generateTransactions = () => {
  const types = ["ingreso", "gasto"];
  const companies = ["Bank Global", "Fashion Hub", "Tech Solutions", "Hotel Ritz", "Amazon Web Services", "OpenAI", "Google Cloud"];
  
  return Array.from({ length: 45 }).map((_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = initialCategories[Math.floor(Math.random() * initialCategories.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    // Assign a clientId to some income transactions
    const clientId = type === 'ingreso' && Math.random() > 0.3 
      ? MOCK_CLIENTS[Math.floor(Math.random() * MOCK_CLIENTS.length)].id 
      : undefined;
    
    return {
      id: (i + 1).toString(),
      description: `${type === 'ingreso' ? 'Servicio' : 'Gasto'} ${company} #${i + 1}`,
      amount: Math.floor(Math.random() * 5000) + 100,
      type: type as "ingreso" | "gasto",
      category: category.name,
      clientId,
      date: date.toISOString().split('T')[0],
      status: "completado",
      document: i % 3 === 0 ? "factura.pdf" : null
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
};

const ITEMS_PER_PAGE = 20;

export default function FinancesPage() {
  const [transactions, setTransactions] = useState(() => generateTransactions());
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [summaryRange, setSummaryRange] = useState("mes");
  
  const [newTransaction, setNewTransaction] = useState({ 
    description: "", 
    amount: "", 
    type: "ingreso" as "ingreso" | "gasto", 
    category: initialCategories[0].name,
    clientId: "",
    clientName: "", // For new clients
    invoice: null as File | null,
    contract: null as File | null,
    budget: null as File | null,
    permanence: "",
    initialPayment: "",
    monthlyPayment: ""
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Transaction Actions States
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [showConfirmDeleteTx, setShowConfirmDeleteTx] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ReturnType<typeof generateTransactions>[0] | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<ReturnType<typeof generateTransactions>[0] | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Ref for actions dropdown
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  // Ref for category dropdown
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || tx.type === filterType;
      const txDate = new Date(tx.date);
      const matchesFrom = !dateRange.from || txDate >= new Date(dateRange.from);
      const matchesTo = !dateRange.to || txDate <= new Date(dateRange.to);
      return matchesSearch && matchesType && matchesFrom && matchesTo;
    });
  }, [transactions, searchTerm, filterType, dateRange]);

  // Summary Logic
  const summaryData = useMemo(() => {
    const now = new Date();
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      if (summaryRange === "mes") return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      if (summaryRange === "semana") {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return txDate >= startOfWeek;
      }
      if (summaryRange === "año") return txDate.getFullYear() === now.getFullYear();
      return true;
    });

    const income = filtered.filter(t => t.type === 'ingreso').reduce((acc, tx) => acc + tx.amount, 0);
    const expense = filtered.filter(t => t.type === 'gasto').reduce((acc, tx) => acc + tx.amount, 0);
    
    return {
      balance: income - expense,
      income,
      expense,
      count: filtered.length
    };
  }, [transactions, summaryRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const txData = {
      description: newTransaction.description,
      amount: Number(newTransaction.amount) || 0,
      type: newTransaction.type,
      category: newTransaction.category,
      clientId: newTransaction.clientId || undefined,
      document: newTransaction.invoice ? newTransaction.invoice.name : (editingTransaction ? editingTransaction.document : null)
    };

    // --- AUTOMATIC CLIENT LOGIC ---
    if (newTransaction.type === "ingreso") {
      let activeClientId = newTransaction.clientId;
      
      // If it's a new client name
      if (!activeClientId && newTransaction.clientName) {
        const newClient = {
          id: `c-${Date.now()}`,
          name: newTransaction.clientName,
          contactName: newTransaction.clientName,
          industry: "General",
          status: "activo" as const,
          email: `${newTransaction.clientName.toLowerCase().replace(/\s/g, '')}@example.com`,
          phone: "600 000 000",
          nif: "B12345678",
          initialPayment: Number(newTransaction.initialPayment) || 0,
          monthlyPayment: Number(newTransaction.monthlyPayment) || 0,
          permanence: Number(newTransaction.permanence) || 12,
          onlyInitial: false,
          createdAt: new Date().toISOString().split('T')[0]
        };
        MOCK_CLIENTS.push(newClient);
        activeClientId = newClient.id;
        txData.clientId = activeClientId;
      } else if (activeClientId) {
        // Update existing client with new financial data if provided
        const client = MOCK_CLIENTS.find(c => c.id === activeClientId);
        if (client) {
          if (newTransaction.initialPayment) client.initialPayment = Number(newTransaction.initialPayment);
          if (newTransaction.monthlyPayment) client.monthlyPayment = Number(newTransaction.monthlyPayment);
          if (newTransaction.permanence) client.permanence = Number(newTransaction.permanence);
        }
      }
    }

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...editingTransaction, ...txData } : t));
      setEditingTransaction(null);
    } else {
      const tx = {
        id: Date.now().toString(),
        ...txData,
        date: new Date().toISOString().split('T')[0],
        status: "completado"
      };
      setTransactions([tx, ...transactions]);
      setCurrentPage(1);
    }

    setShowModal(false);
    setShowSuccess(true);
    setNewTransaction({ 
      description: "", 
      amount: "", 
      type: "ingreso", 
      category: categories[0].name, 
      clientId: "", 
      clientName: "",
      invoice: null,
      contract: null,
      budget: null,
      permanence: "",
      initialPayment: "",
      monthlyPayment: ""
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete));
      setShowConfirmDelete(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteTransaction = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      setShowConfirmDeleteTx(false);
      setTransactionToDelete(null);
    }
  };

  const handleEditTransaction = (tx: ReturnType<typeof generateTransactions>[0]) => {
    setEditingTransaction(tx);
    setNewTransaction({
      description: tx.description,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      clientId: tx.clientId || "",
      clientName: "",
      invoice: null,
      contract: null,
      budget: null,
      permanence: "",
      initialPayment: "",
      monthlyPayment: ""
    });
    setShowModal(true);
    setOpenMenuId(null);
  };

  return (
    <div className="flex flex-col gap-8 font-sans px-10 pt-10 pb-10 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 right-8 z-[120] flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-xl shadow-2xl font-black text-xs uppercase tracking-widest" >
            <Check className="w-4 h-4" />
            Asiento Contable Registrado
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-2xl font-outfit font-black tracking-tight text-foreground">Libro Contable</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1 opacity-60">Gestión de flujos, facturación y activos estratégicos.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="hidden md:flex items-center gap-2.5 bg-secondary hover:bg-border text-foreground px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-border"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Categorías</span>
          </button>
          <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border shadow-inner">
             {["semana", "mes", "año", "todos"].map((r) => (
              <button
                key={r}
                onClick={() => setSummaryRange(r)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-outfit font-black uppercase tracking-[0.2em] transition-all",
                  summaryRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Asiento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: `Balance ${summaryRange}`, value: `€${summaryData.balance.toLocaleString()}`, icon: Wallet, color: "text-primary", border: "border-primary/20" },
          { label: `Ingresos ${summaryRange}`, value: `€${summaryData.income.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500", border: "border-emerald-500/20" },
          { label: `Gastos ${summaryRange}`, value: `€${summaryData.expense.toLocaleString()}`, icon: TrendingDown, color: "text-rose-500", border: "border-rose-500/20" },
          { label: "Operaciones", value: summaryData.count.toString(), icon: Activity, color: "text-foreground/40", border: "border-border" },
        ].map((stat, i) => (
          <div key={i} className={cn("p-8 rounded-[2rem] bg-card border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all", stat.border)}>
            <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Improved Filter Bar with Fully Custom Date Picker UI */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-secondary/20 p-6 rounded-[2rem] border border-border/50 shadow-inner">
        <div className="relative flex-1 max-w-sm w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Auditar movimientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-bold tracking-tight shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* Custom Date Range Picker (No native inputs) */}
          <div className="flex items-center gap-6 bg-card border border-border rounded-2xl px-6 py-3.5 shadow-sm hover:border-primary/40 transition-all">
             <CalendarDays className="w-4 h-4 text-primary" />
             <div className="flex items-center gap-4">
                <CustomDatePicker value={dateRange.from} onChange={val => setDateRange({...dateRange, from: val})} placeholder="DD/MM/AAAA" />
                <span className="text-[10px] opacity-20 font-black">→</span>
                <CustomDatePicker value={dateRange.to} onChange={val => setDateRange({...dateRange, to: val})} placeholder="DD/MM/AAAA" />
             </div>
             {(dateRange.from || dateRange.to) && (
               <button onClick={() => setDateRange({ from: "", to: "" })} className="p-1 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>
             )}
          </div>

          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-2xl shadow-sm">
            {["todos", "ingreso", "gasto"].map((type) => (
              <button
                key={type}
                onClick={() => { setFilterType(type); setCurrentPage(1); }}
                className={cn(
                  "px-6 py-2.5 text-[10px] font-outfit font-black uppercase tracking-[0.25em] rounded-xl transition-all active:scale-95",
                  filterType === type ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead>
              <tr className="bg-secondary/30 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] w-auto">Asiento / Categoría</th>
                <th className="px-8 py-6 text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] text-center w-[160px]">Fecha</th>
                <th className="px-8 py-6 text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] text-center w-[140px]">Tipo</th>
                <th className="px-8 py-6 text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] text-center w-[160px]">Monto Neto</th>
                <th className="px-8 py-6 text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] text-right w-[140px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {currentTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className={cn(
                    "group hover:bg-secondary/10 transition-all relative",
                    openMenuId === tx.id && "bg-secondary/20 z-[50]"
                  )}
                >
                  <td className="px-8 py-6 overflow-hidden">
                    <div className="flex items-center gap-4">
                       <div className="min-w-0 flex-1">
                          <p className="font-black text-sm text-foreground group-hover:text-primary transition-colors tracking-tight truncate">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <div className="w-1 h-3 bg-secondary rounded-full" />
                             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 truncate">{tx.category}</p>
                          </div>
                       </div>
                       {tx.document && <Paperclip className="w-3.5 h-3.5 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-[11px] font-black uppercase opacity-60">
                      <Calendar className="w-3.5 h-3.5" />
                      {tx.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        tx.type === "ingreso" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : "bg-rose-500/5 text-rose-600 border-rose-500/20"
                      )}>
                        {tx.type === "ingreso" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {tx.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className={cn("text-sm font-black tracking-tight", tx.type === "ingreso" ? "text-emerald-500" : "text-rose-500")}>
                      {tx.type === "ingreso" ? "+" : "-"}€{tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className={cn(
                        "flex items-center justify-end gap-2 transition-all",
                        openMenuId === tx.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                     )}>
                        {/* 3 DOTS MENU */}
                        <div className="relative" ref={openMenuId === tx.id ? actionsMenuRef : null}>
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                            className={cn(
                              "p-2.5 bg-card hover:bg-secondary rounded-lg border border-border shadow-sm transition-all active:scale-90",
                              openMenuId === tx.id && "bg-secondary border-primary/20"
                            )}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {openMenuId === tx.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                className="absolute right-0 top-[90%] z-[100] bg-card border border-border rounded-2xl shadow-2xl p-1.5 min-w-[140px] text-left"
                              >
                                <button 
                                  onClick={() => handleEditTransaction(tx)}
                                  className="w-full flex items-center gap-2.5 p-2.5 hover:bg-secondary rounded-xl transition-all group/item"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70 group-hover/item:text-foreground">Editar</span>
                                </button>
                                <button 
                                  onClick={() => { setViewingTransaction(tx); setOpenMenuId(null); }}
                                  className="w-full flex items-center gap-2.5 p-2.5 hover:bg-secondary rounded-xl transition-all group/item"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                    <Info className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70 group-hover/item:text-foreground">Info</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* TRASH BUTTON */}
                        <button 
                          onClick={() => { setTransactionToDelete(tx.id); setShowConfirmDeleteTx(true); }}
                          className="p-2.5 bg-card hover:bg-rose-500/10 rounded-lg border border-border text-muted-foreground hover:text-rose-500 transition-all active:scale-90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 border-t border-border bg-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="text-[10px] font-outfit font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
             Registro <span className="text-foreground">{(currentPage-1)*ITEMS_PER_PAGE+1}</span> al <span className="text-foreground">{Math.min(currentPage*ITEMS_PER_PAGE, filteredTransactions.length)}</span>
           </p>
           <div className="flex items-center gap-3">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary disabled:opacity-20 transition-all"><ChevronLeft className="w-4 h-4" /></button>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary disabled:opacity-20 transition-all"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>
      </div>

      {/* FORMAL ASINTO MODAL with Stable Colors & Click Outside Bug Fix */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 40, scale: 0.98 }} 
              className="relative w-full max-w-4xl bg-card border border-border rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh]" 
            >
              <div className="px-8 py-5 bg-secondary/30 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-outfit font-black tracking-tight text-foreground flex items-center gap-3">
                    <FileBadge className="w-5 h-5 text-primary" />
                    {editingTransaction ? "Editar Asiento" : "Nuevo Asiento"}
                  </h2>
                  <p className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-50">Registro Administrativo</p>
                </div>
                <button onClick={() => { setShowModal(false); setEditingTransaction(null); }} className="p-2 hover:bg-card rounded-xl border border-transparent hover:border-border transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-10">
                <form onSubmit={handleAddTransaction} className="space-y-10">
                  <div className="grid grid-cols-2 gap-4 relative">
                     <button 
                       type="button"
                       onClick={() => setNewTransaction({...newTransaction, type: "ingreso"})}
                       className={cn(
                         "p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3",
                         newTransaction.type === "ingreso" 
                            ? "bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-600/20" 
                            : "bg-secondary/30 border-transparent text-muted-foreground opacity-40 hover:opacity-100"
                       )}
                     >
                       <TrendingUp className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Ingreso</span>
                     </button>
                     <button 
                       type="button"
                       onClick={() => setNewTransaction({...newTransaction, type: "gasto"})}
                       className={cn(
                         "p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3",
                         newTransaction.type === "gasto" 
                            ? "bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-600/20" 
                            : "bg-secondary/30 border-transparent text-muted-foreground opacity-40 hover:opacity-100"
                       )}
                     >
                       <TrendingDown className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Gasto</span>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column: Details */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Concepto Operativo</label>
                        <div className="relative">
                          <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                          <input required type="text" placeholder="Ej: Servicio Consultoría" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full bg-secondary/10 border border-border rounded-xl pl-12 pr-5 py-3 text-sm focus:outline-none font-bold transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Monto Neto (€)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <input required type="number" placeholder="0.00" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className="w-full bg-secondary/10 border border-border rounded-xl pl-12 pr-5 py-3 text-sm focus:outline-none font-bold transition-all" />
                          </div>
                        </div>
                        
                        <div className="space-y-2 relative" ref={categoryDropdownRef}>
                          <label className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Categoría</label>
                          <div 
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                            className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-sm font-bold flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-all"
                          >
                            <span className="tracking-tight text-xs truncate">{newTransaction.category}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform opacity-40", isCategoryDropdownOpen ? "rotate-180" : "")} />
                          </div>
                          <AnimatePresence>
                            {isCategoryDropdownOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute z-[410] left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-2 max-h-[200px] overflow-y-auto no-scrollbar"
                              >
                                {categories.map((c) => (
                                  <button key={c.id} type="button" onClick={() => { setNewTransaction({...newTransaction, category: c.name}); setIsCategoryDropdownOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-secondary rounded-xl transition-all group">
                                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm", c.color)}><c.icon className="w-3.5 h-3.5" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{c.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {newTransaction.type === "ingreso" && (
                        <>
                          <div className="space-y-2 relative" ref={clientDropdownRef}>
                            <label className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Cliente / Empresa</label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                <input 
                                  type="text" 
                                  placeholder="Nombre del cliente..." 
                                  value={newTransaction.clientName || MOCK_CLIENTS.find(c => c.id === newTransaction.clientId)?.name || ""} 
                                  onChange={e => {
                                    const val = e.target.value;
                                    const found = MOCK_CLIENTS.find(c => c.name.toLowerCase() === val.toLowerCase());
                                    if (found) {
                                      setNewTransaction({...newTransaction, clientId: found.id, clientName: found.name});
                                    } else {
                                      setNewTransaction({...newTransaction, clientName: val, clientId: ""});
                                    }
                                  }} 
                                  onClick={() => setIsClientDropdownOpen(true)}
                                  className="w-full bg-secondary/10 border border-border rounded-xl pl-12 pr-5 py-3 text-sm focus:outline-none font-bold transition-all" 
                                />
                                <AnimatePresence>
                                  {isClientDropdownOpen && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-[410] left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-2 max-h-[160px] overflow-y-auto no-scrollbar"
                                    >
                                      {MOCK_CLIENTS.map((c) => (
                                        <button key={c.id} type="button" onClick={() => { setNewTransaction({...newTransaction, clientId: c.id, clientName: c.name}); setIsClientDropdownOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-secondary rounded-xl transition-all group">
                                          <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary shadow-sm"><Building2 className="w-3.5 h-3.5" /></div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{c.name}</span>
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest px-1">Meses Permanencia</label>
                              <input type="number" placeholder="12" value={newTransaction.permanence} onChange={e => setNewTransaction({...newTransaction, permanence: e.target.value})} className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none font-bold transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest px-1">Pago Inicial (€)</label>
                              <input type="number" placeholder="1500" value={newTransaction.initialPayment} onChange={e => setNewTransaction({...newTransaction, initialPayment: e.target.value})} className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none font-bold transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black text-muted-foreground uppercase tracking-widest px-1">Mensualidad (€)</label>
                              <input type="number" placeholder="150" value={newTransaction.monthlyPayment} onChange={e => setNewTransaction({...newTransaction, monthlyPayment: e.target.value})} className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none font-bold transition-all" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Column: Documents */}
                    <div className="space-y-5">
                      <label className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Documentación / Archivos</label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { id: 'contract' as const, label: 'Contrato', icon: FileText, file: newTransaction.contract },
                          { id: 'budget' as const, label: 'Presupuesto', icon: BarChart3, file: newTransaction.budget },
                          { id: 'invoice' as const, label: 'Factura', icon: Receipt, file: newTransaction.invoice }
                        ].map((doc) => (
                          <label key={doc.id} className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer group",
                            doc.file ? "bg-primary/5 border-primary/30" : "bg-secondary/10 border-border hover:border-primary/30"
                          )}>
                            <input type="file" className="hidden" onChange={e => setNewTransaction({...newTransaction, [doc.id]: e.target.files?.[0] || null})} />
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", doc.file ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground group-hover:text-primary")}>
                              {doc.file ? <Check className="w-5 h-5" /> : <doc.icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{doc.label}</p>
                              <p className="text-[9px] font-bold text-muted-foreground opacity-50 truncate">{doc.file ? doc.file.name : "Seleccionar archivo..."}</p>
                            </div>
                            {doc.file && (
                              <button type="button" onClick={e => { e.preventDefault(); setNewTransaction({...newTransaction, [doc.id]: null}); }} className="p-1.5 hover:bg-rose-500/10 rounded-xl text-rose-500 transition-all"><X className="w-4 h-4" /></button>
                            )}
                          </label>
                        ))}
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-start gap-3">
                          <Zap className="w-4 h-4 text-primary mt-0.5" />
                          <p className="text-[9px] font-bold text-primary/70 uppercase tracking-widest leading-relaxed">Al finalizar, se creará automáticamente la ficha del cliente con toda la documentación vinculada.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => { setShowModal(false); setEditingTransaction(null); }} className="flex-1 px-6 py-4 rounded-xl border border-border text-[9px] font-black uppercase tracking-widest hover:bg-secondary transition-all">Descartar</button>
                    <button type="submit" className="flex-[2] px-6 py-4 rounded-xl bg-foreground text-background text-[9px] font-black uppercase tracking-[0.3em] hover:bg-foreground/90 shadow-xl transition-all">
                      {editingTransaction ? "Guardar Cambios" : "Formalizar Registro"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY MANAGEMENT MODAL */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCategoryModal(false)} className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl flex flex-col"
            >
              <div className="px-8 py-7 bg-secondary/30 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-outfit font-black tracking-tight text-foreground flex items-center gap-3">
                  <Settings2 className="w-6 h-6 text-primary" />
                  Categorías
                </h2>
                <button onClick={() => setShowCategoryModal(false)} className="p-2.5 hover:bg-card rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-2xl group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0", c.color)}>
                          <c.icon className="w-5 h-5" />
                       </div>
                       {editingCategoryId === c.id ? (
                         <input
                           autoFocus
                           value={editingCategoryName}
                           onChange={e => setEditingCategoryName(e.target.value)}
                           onKeyDown={e => {
                             if (e.key === 'Enter' && editingCategoryName.trim()) {
                               setCategories(categories.map(cat => cat.id === c.id ? {...cat, name: editingCategoryName.trim()} : cat));
                               setEditingCategoryId(null);
                             }
                             if (e.key === 'Escape') setEditingCategoryId(null);
                           }}
                           className="flex-1 bg-card border border-primary/40 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest focus:outline-none shadow-sm"
                         />
                       ) : (
                         <span className="text-xs font-black uppercase tracking-widest text-foreground truncate">{c.name}</span>
                       )}
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                       {editingCategoryId === c.id ? (
                         <>
                           <button onClick={() => { if (editingCategoryName.trim()) { setCategories(categories.map(cat => cat.id === c.id ? {...cat, name: editingCategoryName.trim()} : cat)); } setEditingCategoryId(null); }} className="p-2 bg-primary text-white rounded-lg transition-all"><Check className="w-4 h-4" /></button>
                           <button onClick={() => setEditingCategoryId(null)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all"><X className="w-4 h-4" /></button>
                         </>
                       ) : (
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setEditingCategoryId(c.id); setEditingCategoryName(c.name); }} className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-primary transition-all"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => { setCategoryToDelete(c.id); setShowConfirmDelete(true); }} className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       )}
                    </div>
                  </div>
                ))}

                {showNewCategoryForm ? (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border-2 border-primary/30 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      autoFocus
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      placeholder="Nombre de categoría..."
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newCategoryName.trim()) {
                          setCategories([...categories, { id: Date.now().toString(), name: newCategoryName.trim(), color: "bg-slate-500", icon: Settings2 }]);
                          setNewCategoryName("");
                          setShowNewCategoryForm(false);
                        }
                        if (e.key === 'Escape') { setShowNewCategoryForm(false); setNewCategoryName(""); }
                      }}
                      className="flex-1 bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none placeholder:normal-case placeholder:tracking-normal placeholder:font-medium placeholder:text-muted-foreground/40"
                    />
                    <button onClick={() => { if (newCategoryName.trim()) { setCategories([...categories, { id: Date.now().toString(), name: newCategoryName.trim(), color: "bg-slate-500", icon: Settings2 }]); setNewCategoryName(""); setShowNewCategoryForm(false); } }} className="p-2 bg-primary text-white rounded-lg transition-all shrink-0"><Check className="w-4 h-4" /></button>
                    <button onClick={() => { setShowNewCategoryForm(false); setNewCategoryName(""); }} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-all shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button onClick={() => setShowNewCategoryForm(true)} className="w-full py-5 border-2 border-dashed border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary/30 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-3">
                    <Plus className="w-4 h-4" /> Nueva Categoría
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSACTION DETAILS MODAL */}
      <AnimatePresence>
        {viewingTransaction && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingTransaction(null)} className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 40, scale: 0.98 }} 
              className="relative w-full max-w-lg bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className={cn(
                "px-8 py-10 text-center",
                viewingTransaction.type === "ingreso" ? "bg-emerald-500/5" : "bg-rose-500/5"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl",
                  viewingTransaction.type === "ingreso" ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
                )}>
                  {viewingTransaction.type === "ingreso" ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
                </div>
                <h2 className="text-3xl font-outfit font-black tracking-tight text-foreground">{viewingTransaction.description}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2 opacity-50">{viewingTransaction.category}</p>
                <div className="mt-6">
                  <p className={cn(
                    "text-4xl font-black tracking-tighter",
                    viewingTransaction.type === "ingreso" ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {viewingTransaction.type === "ingreso" ? "+" : "-"}€{viewingTransaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Fecha Contable</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      {viewingTransaction.date}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Cliente / Origen</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Building2 className="w-4 h-4 text-primary" />
                      {viewingTransaction.clientId 
                        ? MOCK_CLIENTS.find(c => c.id === viewingTransaction.clientId)?.name 
                        : "General / Externo"}
                    </div>
                  </div>
                </div>

                {viewingTransaction.document && (
                  <div className="p-6 bg-secondary/20 border border-border rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">{viewingTransaction.document}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Documento adjunto</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-card rounded-lg transition-colors"><Upload className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    onClick={() => setViewingTransaction(null)}
                    className="w-full py-4 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-foreground/90 transition-all shadow-xl"
                  >
                    Cerrar Detalles
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE TRANSACTION MODAL */}
      <AnimatePresence>
        {showConfirmDeleteTx && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/30 backdrop-blur-sm" onClick={() => setShowConfirmDeleteTx(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-outfit font-black text-foreground mb-2">¿Eliminar Registro?</h2>
              <p className="text-xs text-muted-foreground font-bold mb-8 opacity-60">Esta acción no se puede deshacer y el balance general se actualizará inmediatamente.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowConfirmDeleteTx(false)} className="flex-1 py-3 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancelar</button>
                 <button onClick={handleDeleteTransaction} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all">Confirmar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE CATEGORY MODAL */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/30 backdrop-blur-sm" onClick={() => setShowConfirmDelete(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-outfit font-black text-foreground mb-2">¿Eliminar Categoría?</h2>
              <p className="text-xs text-muted-foreground font-bold mb-8 opacity-60">Esta acción no se puede deshacer. Los registros existentes podrían verse afectados.</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowConfirmDelete(false)} className="flex-1 py-3 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancelar</button>
                 <button onClick={handleDeleteCategory} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all">Eliminar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
