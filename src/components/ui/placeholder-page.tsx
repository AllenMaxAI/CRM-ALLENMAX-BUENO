"use client";

import { motion } from "framer-motion";
import { Hammer } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <motion.div
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20"
      >
        <Hammer className="w-10 h-10 text-primary" />
      </motion.div>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">Este módulo está siendo optimizado para tu flujo de trabajo.</p>
      </div>
      <button className="bg-secondary px-6 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors">
        Volver al Dashboard
      </button>
    </div>
  );
}
