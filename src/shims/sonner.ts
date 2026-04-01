const t = (globalThis as any).__kleff__?.toast;
export const toast = t;
// Toaster is already mounted by the panel — export a no-op so bundled @kleffio/ui resolves it.
export const Toaster = () => null;
export default { toast: t, Toaster };
