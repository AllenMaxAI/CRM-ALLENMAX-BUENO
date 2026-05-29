"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl bg-opacity-10", color)}>
          <Icon className={cn("w-5 h-5", color.replace("bg-", "text-"))} />
        </div>
        <div className={cn(
          "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
          trend === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
        )}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      
      <div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
      </div>

      {/* Decorative element */}
      <div className={cn(
        "absolute -bottom-6 -right-6 w-24 h-24 blur-[40px] rounded-full opacity-0 group-hover:opacity-20 transition-standard pointer-events-none",
        color
      )} />
    </motion.div>
  );
}
