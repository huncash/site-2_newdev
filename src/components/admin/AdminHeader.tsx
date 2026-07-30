import type { ReactNode } from "react";

export function AdminHeader({
  badge,
  title,
  right,
}: {
  badge: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/assets/logo-icon.png"
          alt="Projektorlámpacsere.hu logó"
          width={44}
          height={44}
          className="w-11 h-11 rounded-md shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight">Projektorlámpacsere.hu</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {badge}
            </span>
          </div>
          <div className="text-xs text-muted-foreground italic mt-0.5 truncate">
            Eredeti gyári izzó, méretpontos utángyártott kerettel — kerülőutak nélkül.
          </div>
          <div className="text-sm font-semibold mt-1">{title}</div>
        </div>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </header>
  );
}
