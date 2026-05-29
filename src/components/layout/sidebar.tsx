"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  CheckSquare,
  FileText,
  Share2,
  Code2,
  Settings,
  MessageSquare,
  ChevronRight,
  Building2,
  Target,
  KeyRound,
  ChevronDown,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mainGroups = [
  {
    name: "Principal",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Finanzas", href: "/finances", icon: TrendingUp },
    ],
  },
  {
    name: "CRM",
    items: [
      { title: "Clientes", href: "/clients", icon: Building2 },
      { title: "Leads", href: "/leads", icon: Target },
      { title: "Freelancers", href: "/freelancers", icon: Users },
    ],
  },
  {
    name: "Operaciones",
    items: [
      { title: "Proyectos", href: "/projects", icon: Briefcase },
      { title: "Calendario", href: "/calendar", icon: Calendar },
      { title: "Planificación", href: "/tasks", icon: CheckSquare },
    ],
  },
  {
    name: "Recursos",
    items: [
      { title: "Contenido", href: "/content", icon: Share2 },
      { title: "Documentos", href: "/documents", icon: FileText },
      { title: "Recursos Técnicos", href: "/resources", icon: Code2 },
      { title: "Bóveda", href: "/vault", icon: KeyRound },
    ],
  },
  {
    name: "Ajustes",
    items: [
      { title: "Configuración", href: "/settings", icon: Settings },
    ],
  },
];


function NavItem({ 
  item, 
  pathname, 
  isCollapsed 
}: { 
  item: { title: string; href: string; icon: React.ElementType }; 
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center h-10 rounded-xl transition-all duration-300 group relative overflow-hidden",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
      )}
    >
      <div className="flex items-center relative z-10 w-full shrink-0 h-full">
        {/* Stable Icon Container */}
        <div className="w-20 flex items-center justify-center shrink-0">
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
            isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-secondary/40 group-hover:bg-background"
          )}>
            <Icon className={cn("w-4 h-4", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
          </div>
        </div>

        <motion.span 
          initial={false}
          animate={{ 
            opacity: isCollapsed ? 0 : (isActive ? 1 : 0.8),
            x: isCollapsed ? -20 : 0,
            width: isCollapsed ? 0 : "auto",
            marginLeft: isCollapsed ? 0 : 0
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={cn(
            "text-xs font-bold tracking-tight truncate whitespace-nowrap overflow-hidden flex-1",
            !isCollapsed && "group-hover:opacity-100"
          )}
        >
          {item.title}
        </motion.span>
      </div>
      {!isCollapsed && isActive && (
        <motion.div
          layoutId="nav-glow-active"
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl pointer-events-none"
        />
      )}
      {!isCollapsed && isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-1 h-4 bg-primary rounded-full absolute left-0"
        />
      )}
      {!isCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 text-primary opacity-40 absolute right-4 z-10" />}
    </Link>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      }}
      className="h-screen bg-card border-r border-border flex flex-col overflow-hidden shrink-0 z-40 font-sans shadow-xl"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center border-b border-border/50 shrink-0 relative overflow-hidden">
        {/* Stable Menu Button Container */}
        <div className="w-20 flex items-center justify-center shrink-0">
          <button 
            onClick={onToggle}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-all shrink-0 relative z-50"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <motion.div 
          initial={false}
          animate={{ 
            opacity: isCollapsed ? 0 : 1,
            x: isCollapsed ? -20 : 0,
            width: isCollapsed ? 0 : "auto",
            marginLeft: isCollapsed ? 0 : 0
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="flex items-center overflow-hidden whitespace-nowrap"
        >
          <span className="font-jakarta font-bold text-xl tracking-tight text-foreground leading-none ml-2">
            AllenMax
          </span>
        </motion.div>
      </div>

      {/* Main Nav */}
      <div className={cn(
        "flex-1 overflow-hidden transition-all duration-300",
        isCollapsed ? "px-0" : "px-3"
      )}>
        <div className="h-full flex flex-col justify-between py-4">
          {mainGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              <div 
                className={cn(
                  "flex items-center h-8 cursor-pointer group transition-all duration-300 relative",
                  isCollapsed ? "justify-center" : "pl-5 pr-4 justify-between"
                )}
                onClick={() => !isCollapsed && toggleGroup(group.name)}
              >
                <AnimatePresence mode="wait">
                  {!isCollapsed ? (
                    <motion.div 
                      key="text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between w-full"
                    >
                      <h3 className="text-[9px] font-outfit font-black text-muted-foreground uppercase tracking-[0.25em] opacity-50 group-hover:opacity-100 transition-opacity">
                        {group.name}
                      </h3>
                      <ChevronDown className={cn(
                        "w-3 h-3 text-muted-foreground transition-transform duration-300",
                        collapsedGroups.includes(group.name) ? "-rotate-90" : "rotate-0"
                      )} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="line"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      className="w-8 h-px bg-border/50" 
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence mode="wait">
                {(!collapsedGroups.includes(group.name) || isCollapsed) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {group.items.map((item) => (
                      <NavItem 
                        key={item.href} 
                        item={item} 
                        pathname={pathname} 
                        isCollapsed={isCollapsed} 
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}


