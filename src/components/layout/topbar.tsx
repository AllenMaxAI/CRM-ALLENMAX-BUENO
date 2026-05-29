"use client";

import { Search, Plus, Bell, Command, UserCircle, Zap, X, Target, Users, DollarSign, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Topbar() {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const quickActions = [
    { label: "Nuevo Lead", icon: Target, href: "/leads", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Añadir Cliente", icon: Users, href: "/clients", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Registrar Pago", icon: DollarSign, href: "/finances", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Nuevo Proyecto", icon: Briefcase, href: "/projects", color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <header className="h-20 border-b border-border bg-card/80 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-500" />
  );
}
