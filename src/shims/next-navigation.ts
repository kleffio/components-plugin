const nav = (globalThis as any).__kleff__?.navigation ?? {};
export const { usePathname, useRouter, useSearchParams } = nav;
