"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Cog, Wrench, Scissors } from "lucide-react";

type MachineCardProps = {
  name: string;
  type: string;
  control?: string;
  description: string;
  quantity: string;
  index: number;
};

function getMachineIcon(type: string) {
  if (type.toLowerCase().includes("soustruh") || type.toLowerCase().includes("lathe"))
    return Cog;
  if (type.toLowerCase().includes("fréz") || type.toLowerCase().includes("mill"))
    return Wrench;
  return Scissors;
}

export function MachineCard({
  name,
  type,
  control,
  description,
  quantity,
  index,
}: MachineCardProps) {
  const Icon = getMachineIcon(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <Badge variant="secondary" className="text-xs">
          {quantity}
        </Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-primary">{type}</p>
      {control && (
        <p className="mt-1 text-xs text-muted-foreground">
          Řízení: {control}
        </p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
