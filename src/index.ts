import { definePlugin } from "@kleffio/sdk";
import { ComponentsPage } from "./ComponentsPage";
import { ComponentsNavItem } from "./NavbarItem";

export const componentsPlugin = definePlugin({
  manifest: {
    id: "kleff.components",
    name: "Component Showcase",
    version: "1.0.0",
    description: "UI primitives and domain component showcase.",
    icon: "Layers",
    slots: [
      {
        slot: "page",
        component: ComponentsPage,
        props: { path: "/p/components" },
      },
      {
        slot: "navbar.item",
        component: ComponentsNavItem,
      },
    ],
  },
});

if (typeof window !== "undefined" && (window as any).__kleff__?.registry) {
  (window as any).__kleff__.registry.register(componentsPlugin);
}
