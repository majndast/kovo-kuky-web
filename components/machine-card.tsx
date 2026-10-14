"use client";

import { Bezel, Reveal } from "@/components/ui-kit";

type MachineCardProps = {
  name: string;
  type: string;
  control?: string;
  controlLabel?: string;
  description: string;
  quantity: string;
  specs?: string[];
  index: number;
};

export function MachineCard({
  name,
  type,
  control,
  controlLabel = "Řízení",
  description,
  quantity,
  specs,
  index,
}: MachineCardProps) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <Bezel
        className="h-full hover:bg-white/[0.06] hover:ring-primary/30"
        innerClassName="flex h-full flex-col p-7 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-[-0.03em]">{name}</h3>
          <span className="shrink-0 rounded-full bg-white/[0.07] px-3 py-1 text-sm text-foreground/80 ring-1 ring-white/10">
            {quantity}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-primary">
          {type}
          {control ? ` · ${controlLabel} ${control}` : ""}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>

        {specs && specs.length > 0 && (
          <ul className="mt-auto pt-8 text-sm">
            {specs.map((spec, i) => (
              <li key={i} className="border-t border-white/[0.1] py-3 text-foreground/80">
                {spec}
              </li>
            ))}
          </ul>
        )}
      </Bezel>
    </Reveal>
  );
}
