"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";

export function ComponentsNavItem() {
  const pathname = usePathname();
  const href = "/p/components";
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      ].join(" ")}
    >
      <Layers className="size-4 shrink-0" />
      Components
    </Link>
  );
}
