"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Info,
  OctagonX,
  Server,
  Star,
  TriangleAlert,
  Zap,
} from "lucide-react";

// UI Primitives
// Local fallback copies retained in ./glow-follow and ./progress for easy reversal.
// import { installGlowFollow } from "./glow-follow";
// import { Progress } from "./progress";
import { installGlowFollow, Progress } from "@kleffio/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@kleffio/ui";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@kleffio/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kleffio/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@kleffio/ui";
import { Badge } from "@kleffio/ui";
import { Button } from "@kleffio/ui";
import { ButtonGroup } from "@kleffio/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@kleffio/ui";
import { Checkbox } from "@kleffio/ui";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kleffio/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@kleffio/ui";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@kleffio/ui";
import { Field, FieldLabel, FieldTitle } from "@kleffio/ui";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kleffio/ui";
import { Input } from "@kleffio/ui";
import { Item } from "@kleffio/ui";
import { Label } from "@kleffio/ui";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@kleffio/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@kleffio/ui";
import { RadioGroup, RadioGroupItem } from "@kleffio/ui";
import { ScrollArea } from "@kleffio/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@kleffio/ui";
import { Separator } from "@kleffio/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kleffio/ui";
import { Skeleton } from "@kleffio/ui";
import { Slider } from "@kleffio/ui";
import { Switch } from "@kleffio/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@kleffio/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kleffio/ui";
import { Textarea } from "@kleffio/ui";
import { Toggle } from "@kleffio/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kleffio/ui";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@kleffio/ui";

// Domain Components
import { MetricCard } from "./domain/MetricCard";
import { PlanBadge } from "./domain/PlanBadge";
import { RegionBadge } from "./domain/RegionBadge";
import { ServerCard } from "./domain/ServerCard";
import { StatusBadge } from "./domain/StatusBadge";

installGlowFollow();

// ─── Chart data & configs ─────────────────────────────────────────────────────

const playerActivityData = [
  { time: "00:00", players: 4 },
  { time: "04:00", players: 2 },
  { time: "08:00", players: 6 },
  { time: "12:00", players: 14 },
  { time: "16:00", players: 18 },
  { time: "20:00", players: 22 },
  { time: "23:59", players: 11 },
];

const playerActivityConfig = {
  players: { label: "Players", color: "var(--color-primary)" },
} satisfies ChartConfig;

const serverResourceData = [
  { server: "Survival", cpu: 42, mem: 67 },
  { server: "Viking", cpu: 0, mem: 0 },
  { server: "Factorio", cpu: 78, mem: 55 },
  { server: "Rust PvP", cpu: 31, mem: 44 },
];

const serverResourceConfig = {
  cpu: { label: "CPU %", color: "var(--color-chart-1)" },
  mem: { label: "Memory %", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

const serverStatusData = [
  { name: "Running", value: 3, color: "oklch(0.6 0.16 145)" },
  { name: "Stopped", value: 1, color: "oklch(0.5 0 0)" },
  { name: "Crashed", value: 1, color: "oklch(0.63 0.24 27)" },
];

const serverStatusConfig = {
  Running: { label: "Running", color: "oklch(0.6 0.16 145)" },
  Stopped: { label: "Stopped", color: "oklch(0.5 0 0)" },
  Crashed: { label: "Crashed", color: "oklch(0.63 0.24 27)" },
} satisfies ChartConfig;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SERVER = {
  id: "srv-01",
  organizationId: "org-001",
  name: "Minecraft Survival",
  gameType: "Minecraft Java",
  status: "running" as const,
  region: "us-east-1" as const,
  currentPlayers: 8,
  plan: { id: "plan-pro", tier: "pro" as const, name: "Pro", vcpu: 4, memoryGb: 8, storageGb: 100, bandwidthGb: 2000, maxPlayers: 20, pricePerHour: 0.12 },
  ipAddress: "54.210.3.99",
  port: 25565,
  resources: { cpuPercent: 42, memoryPercent: 67, diskPercent: 23, networkInMbps: 12, networkOutMbps: 8 },
  createdAt: "2024-11-01T00:00:00Z",
  updatedAt: "2024-11-01T00:00:00Z",
};

const MOCK_SERVER_STOPPED = {
  ...MOCK_SERVER,
  id: "srv-02",
  name: "Valheim Viking Realm",
  gameType: "Valheim",
  status: "stopped" as const,
  region: "eu-central-1" as const,
  currentPlayers: 0,
  plan: { id: "plan-starter", tier: "starter" as const, name: "Starter", vcpu: 2, memoryGb: 4, storageGb: 50, bandwidthGb: 500, maxPlayers: 10, pricePerHour: 0.05 },
  ipAddress: undefined,
  resources: undefined,
};

const TABLE_ROWS = [
  { id: "INV-001", date: "Mar 1, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$14.00", status: "Paid" },
];

const PROGRESS_SPEEDS = [1, 3, 5] as const;
const PROGRESS_TICK_MS = 100;

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="component-showcase-section">
      <h2 className="component-showcase-section-title">{title}</h2>
      <div className="component-showcase-section-body">{children}</div>
    </section>
  );
}

function Row({ children, wrap = false }: { children: ReactNode; wrap?: boolean }) {
  return (
    <div className={`component-showcase-demo-row ${wrap ? "component-showcase-demo-row-wrap" : ""}`}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ComponentsPage() {
  const [progress, setProgress] = useState(60);
  const [progressSpeed, setProgressSpeed] = useState<0 | (typeof PROGRESS_SPEEDS)[number]>(0);
  const [sliderValue, setSliderValue] = useState([40]);
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const progressLabel = `${Math.round(progress)}%`;

  useEffect(() => {
    if (progressSpeed === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = current + progressSpeed * (PROGRESS_TICK_MS / 1000);

        return next >= 100 ? 0 : Number(next.toFixed(2));
      });
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(interval);
  }, [progressSpeed]);

  return (
    <TooltipProvider>
      <div className="component-showcase-shell">
        <div className="component-showcase-orb component-showcase-orb-primary" />
        <div className="component-showcase-orb component-showcase-orb-blue" />
        <div className="component-showcase-orb component-showcase-orb-purple" />
        <div className="component-showcase-orb component-showcase-orb-amber-mid" />
        <div className="component-showcase-orb component-showcase-orb-cyan" />
        <div className="component-showcase-orb component-showcase-orb-rose" />
        <div className="component-showcase-orb component-showcase-orb-green" />
        <div className="component-showcase-orb component-showcase-orb-amber-low" />

        <div className="component-showcase-inner">
          {/* Header */}
          <div className="component-showcase-header">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-widest text-primary/80">Design System</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-sm">Component Showcase</h1>
              <p className="max-w-2xl text-sm text-white/50">All UI primitives and domain components rendered with the account home glass treatment.</p>
            </div>
            <div className="component-showcase-pill">
              @kleffio/ui
            </div>
          </div>

          <div className="component-showcase-stats">
            <div data-frosted="true" className="overview-glass-card component-showcase-stat">
              <span className="component-showcase-stat-icon"><Zap className="size-4" /></span>
              <div>
                <p className="component-showcase-stat-label">Primitives</p>
                <p className="component-showcase-stat-value">30+</p>
              </div>
            </div>
            <div data-frosted="true" className="overview-glass-card component-showcase-stat">
              <span className="component-showcase-stat-icon"><Server className="size-4" /></span>
              <div>
                <p className="component-showcase-stat-label">Domain Cards</p>
                <p className="component-showcase-stat-value">5</p>
              </div>
            </div>
            <div data-frosted="true" className="overview-glass-card component-showcase-stat">
              <span className="component-showcase-stat-icon"><Star className="size-4" /></span>
              <div>
                <p className="component-showcase-stat-label">Surface Style</p>
                <p className="component-showcase-stat-value">Glass</p>
              </div>
            </div>
          </div>

          <div className="component-showcase-content">

            {/* ── Buttons ── */}
            <Section title="Buttons">
              <Row wrap>
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </Row>
              <Row wrap>
                <Button size="xs">XSmall</Button>
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Bell /></Button>
                <Button size="icon" variant="outline"><Star /></Button>
              </Row>
              <Row wrap>
                <Button disabled>Disabled</Button>
                <Button><Zap /> With Icon</Button>
                <ButtonGroup>
                  <Button variant="outline">Day</Button>
                  <Button variant="outline">Week</Button>
                  <Button variant="outline">Month</Button>
                </ButtonGroup>
              </Row>
            </Section>

            <Separator />

            {/* ── Badges ── */}
            <Section title="Badges">
              <Row wrap>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </Row>
            </Section>

            <Separator />

            {/* ── Alerts ── */}
            <Section title="Alerts">
              <Alert variant="info">
                <Info className="size-4" />
                <AlertTitle>Scheduled maintenance</AlertTitle>
                <AlertDescription>
                  Your servers will be unreachable on Mar 22 from 02:00–04:00 UTC while we apply infrastructure updates.
                </AlertDescription>
              </Alert>
              <Alert variant="success">
                <CheckCircle2 className="size-4" />
                <AlertTitle>Deployment complete</AlertTitle>
                <AlertDescription>
                  Minecraft Survival is now running on node <code className="rounded bg-foreground/10 px-1 font-mono text-xs">node-07</code> in us-east-1.
                </AlertDescription>
              </Alert>
              <Alert variant="warning">
                <TriangleAlert className="size-4" />
                <AlertTitle>High memory usage</AlertTitle>
                <AlertDescription>
                  Valheim Viking Realm is using 89% of available memory. Consider upgrading to the Business plan.
                </AlertDescription>
                <AlertAction>
                  <Button size="xs" variant="outline">Upgrade</Button>
                </AlertAction>
              </Alert>
              <Alert variant="destructive">
                <OctagonX className="size-4" />
                <AlertTitle>Server crashed</AlertTitle>
                <AlertDescription>
                  Factorio World has stopped unexpectedly. Check the logs for more details.
                </AlertDescription>
                <AlertAction>
                  <Button size="xs" variant="outline">View logs</Button>
                </AlertAction>
              </Alert>
            </Section>

            <Separator />

            {/* ── Toasts ── */}
            <Section title="Toasts">
              <Row wrap>
                <Button variant="outline" size="sm" onClick={() => toast("Server restarted", { description: "Minecraft Survival is back online." })}>
                  Default
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Deployment complete", { description: "Your server is now live in us-east-1." })}>
                  Success
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info("Scheduled maintenance", { description: "Downtime window starts in 30 minutes." })}>
                  Info
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.warning("High memory usage", { description: "Consider upgrading your plan." })}>
                  Warning
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.error("Server crashed", { description: "Check the logs for details." })}>
                  Error
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const id = toast.loading("Deploying server…");
                  setTimeout(() => toast.success("Deployed!", { id, description: "Server is now live." }), 2500);
                }}>
                  Loading → Success
                </Button>
              </Row>
            </Section>

            <Separator />

            {/* ── Cards ── */}
            <Section title="Cards">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card data-frosted="true" data-focus="false" data-spotlight="true" className="overview-glass-card">
                  <CardHeader>
                    <CardTitle>Server Statistics</CardTitle>
                    <CardDescription>Last 30 days overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/[0.55] text-sm">Uptime: 99.9% · Avg players: 12 · Peak: 18</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">View Details</Button>
                  </CardFooter>
                </Card>

                <Card data-frosted="false" data-focus="false" data-spotlight="false" className="overview-glass-card">
                  <CardHeader>
                    <CardTitle>Billing Summary</CardTitle>
                    <CardDescription>Current billing period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">$29.00</p>
                    <p className="text-white/[0.55] text-sm mt-1">Due Apr 1, 2026</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Pay Now</Button>
                  </CardFooter>
                </Card>
              </div>
            </Section>

            <Separator />

            {/* ── Form Elements ── */}
            <Section title="Form Elements">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <Field>
                    <FieldTitle>Server Name</FieldTitle>
                    <Input placeholder="e.g. My Minecraft Server" defaultValue="Survival World" />
                  </Field>
                  <Field>
                    <FieldTitle>Description</FieldTitle>
                    <Textarea placeholder="Describe your server..." rows={3} />
                  </Field>
                  <Field>
                    <FieldTitle>Region</FieldTitle>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                        <SelectItem value="eu-central-1">EU Central (Frankfurt)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Game Type</Label>
                    <RadioGroup defaultValue="minecraft">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="minecraft" id="mc" />
                        <Label htmlFor="mc">Minecraft Java</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="valheim" id="val" />
                        <Label htmlFor="val">Valheim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="factorio" id="fac" />
                        <Label htmlFor="fac">Factorio</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="backups"
                        checked={checked}
                        onCheckedChange={(v) => setChecked(!!v)}
                      />
                      <Label htmlFor="backups">Enable automatic backups</Label>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance">Maintenance mode</Label>
                      <Switch
                        id="maintenance"
                        checked={switchOn}
                        onCheckedChange={setSwitchOn}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Max Players: {sliderValue[0]}</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      min={2}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </Section>

            <Separator />

            {/* ── Progress & Skeleton ── */}
            <Section title="Progress & Skeleton">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-white/[0.55]">
                    <span>Server capacity</span>
                    <span>{progressLabel}</span>
                  </div>
                  <Progress value={progress} />
                  <Row wrap>
                    <Button size="xs" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>−10</Button>
                    <Button size="xs" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                    {PROGRESS_SPEEDS.map((speed) => (
                      <Button
                        key={speed}
                        size="xs"
                        variant={progressSpeed === speed ? "secondary" : "outline"}
                        onClick={() => setProgressSpeed((current) => (current === speed ? 0 : speed))}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </Row>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm text-white/[0.55]">Loading skeleton</p>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Separator />

            {/* ── Tabs & Accordion ── */}
            <Section title="Tabs & Accordion">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <p className="text-sm text-white/[0.55]">Server overview content — metrics, uptime, player counts.</p>
                </TabsContent>
                <TabsContent value="logs" className="mt-4">
                  <ScrollArea className="glass-surface h-24 rounded-lg border-white/10 p-3 font-mono text-xs text-white/[0.55]">
                    {Array.from({ length: 8 }, (_, i) => (
                      <p key={i}>[2026-03-20 12:0{i}:00] Server tick {i * 100 + 1}ms — {i % 2 === 0 ? "OK" : "players: 8"}</p>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <p className="text-sm text-white/[0.55]">Configuration settings for this server.</p>
                </TabsContent>
              </Tabs>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="network">
                  <AccordionTrigger>Network Settings</AccordionTrigger>
                  <AccordionContent>
                    Configure firewall rules, IP allowlists, and port forwarding for your game server.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="backups">
                  <AccordionTrigger>Backup Configuration</AccordionTrigger>
                  <AccordionContent>
                    Set up automated daily backups. Backups are retained for 7 days on the Pro plan.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="mods">
                  <AccordionTrigger>Mod Manager</AccordionTrigger>
                  <AccordionContent>
                    Install, update, and manage mods from the Steam Workshop or direct upload.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ChevronRight className="size-3.5 transition-transform ui-open:rotate-90" />
                    Advanced Options
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="glass-surface mt-2 rounded-lg border-white/10 p-3 text-sm text-white/[0.55]">
                  JVM flags, custom startup scripts, and environment variable overrides.
                </CollapsibleContent>
              </Collapsible>
            </Section>

            <Separator />

            {/* ── Overlays ── */}
            <Section title="Overlays">
              <Row wrap>
                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>This is a tooltip</TooltipContent>
                </Tooltip>

                {/* Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <p className="text-sm font-medium">Server Info</p>
                    <p className="mt-1 text-xs text-white/[0.55]">
                      Your server is running on a shared node in us-east-1.
                    </p>
                  </PopoverContent>
                </Popover>

                {/* HoverCard */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline" size="sm">Hover Card</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>KL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Kleff Platform</p>
                        <p className="text-xs text-white/[0.55] mt-0.5">Game server hosting for everyone.</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Dropdown</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Restart</DropdownMenuItem>
                    <DropdownMenuItem>View Logs</DropdownMenuItem>
                    <DropdownMenuItem>Edit Config</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete Server</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">Sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Server Settings</SheetTitle>
                      <SheetDescription>
                        Update your server configuration. Changes will take effect on next restart.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 flex flex-col gap-4">
                      <Field>
                        <FieldLabel>Server Name</FieldLabel>
                        <Input defaultValue="Survival World" />
                      </Field>
                      <Field>
                        <FieldLabel>Max Players</FieldLabel>
                        <Input type="number" defaultValue="20" />
                      </Field>
                      <Button className="mt-2">Save Changes</Button>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Alert Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Alert Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Server?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your server and all associated data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Row>
            </Section>

            <Separator />

            {/* ── Avatars ── */}
            <Section title="Avatars">
              <Row>
                <Avatar className="size-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>IS</AvatarFallback>
                </Avatar>
                <Avatar className="size-12">
                  <AvatarFallback className="text-base">KL</AvatarFallback>
                </Avatar>
              </Row>
            </Section>

            <Separator />

            {/* ── Table ── */}
            <Section title="Table">
              <div className="glass-surface overflow-hidden rounded-xl border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_ROWS.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <Check className="size-3" />
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="xs" variant="ghost">Download</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>

            <Separator />

            {/* ── Pagination ── */}
            <Section title="Pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Section>

            <Separator />

            {/* ── Item & Empty ── */}
            <Section title="Item & Empty">
              <div className="glass-surface overflow-hidden rounded-xl border-white/10 divide-y divide-white/[0.06]">
                <Item>
                  <div className="flex items-center gap-3">
                    <Server className="size-4 text-white/40" />
                    <span className="text-sm font-medium">Survival World</span>
                  </div>
                  <Badge variant="secondary">Running</Badge>
                </Item>
                <Item>
                  <div className="flex items-center gap-3">
                    <Server className="size-4 text-white/40" />
                    <span className="text-sm font-medium">Viking Realm</span>
                  </div>
                  <Badge variant="outline">Stopped</Badge>
                </Item>
              </div>

              <Empty>
                <EmptyMedia>
                  <Server className="size-8 text-white/[0.35]" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No servers yet</EmptyTitle>
                  <EmptyDescription>Deploy your first game server to get started.</EmptyDescription>
                </EmptyHeader>
                <Button size="sm">Deploy Server</Button>
              </Empty>
            </Section>

            <Separator />

            {/* ── Toggle ── */}
            <Section title="Toggle">
              <Row>
                <Toggle>Bold</Toggle>
                <Toggle variant="outline">Italic</Toggle>
                <Toggle size="sm">SM</Toggle>
                <Toggle size="lg">LG</Toggle>
              </Row>
            </Section>

            <Separator />

            {/* ── Domain: Badges ── */}
            <Section title="Domain — Status & Plan & Region Badges">
              <Row wrap>
                <StatusBadge status="running" />
                <StatusBadge status="stopped" />
                <StatusBadge status="starting" />
                <StatusBadge status="stopping" />
                <StatusBadge status="provisioning" />
                <StatusBadge status="restarting" />
                <StatusBadge status="crashed" />
                <StatusBadge status="error" />
              </Row>
              <Row wrap>
                <PlanBadge tier="free" />
                <PlanBadge tier="starter" />
                <PlanBadge tier="pro" />
                <PlanBadge tier="business" />
                <PlanBadge tier="enterprise" />
              </Row>
              <Row wrap>
                <RegionBadge region="us-east-1" />
                <RegionBadge region="us-west-2" />
                <RegionBadge region="eu-west-1" />
                <RegionBadge region="eu-central-1" />
                <RegionBadge region="ap-southeast-1" />
                <RegionBadge region="ap-northeast-1" short />
                <RegionBadge region="ca-central-1" short />
                <RegionBadge region="sa-east-1" short />
              </Row>
            </Section>

            <Separator />

            {/* ── Domain: MetricCard ── */}
            <Section title="Domain — Metric Cards">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MetricCard
                  label="Active Servers"
                  value="3"
                  icon={<Server className="size-4" />}
                  delta={{ value: "+1 this week", direction: "up" }}
                  focus
                  spotlight
                />
                <MetricCard
                  label="Total Players"
                  value="42"
                  icon={<Star className="size-4" />}
                  delta={{ value: "+12%", direction: "up" }}
                  frosted={false}
                />
                <MetricCard
                  label="Uptime"
                  value="99.9%"
                  delta={{ value: "unchanged", direction: "neutral" }}
                />
                <MetricCard
                  label="Incidents"
                  value="1"
                  delta={{ value: "+1 today", direction: "down" }}
                />
              </div>
            </Section>

            <Separator />

            {/* ── Domain: ServerCard ── */}
            <Section title="Domain — Server Cards">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ServerCard
                  server={MOCK_SERVER}
                  onStop={(id) => console.log("stop", id)}
                  focus
                  spotlight
                />
                <ServerCard
                  server={MOCK_SERVER_STOPPED}
                  onStart={(id) => console.log("start", id)}
                  frosted={false}
                />
              </div>
            </Section>

            <Separator />

            {/* ── Charts ── */}
            <Section title="Charts">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Area — player activity */}
                <Card data-frosted="true" className="overview-glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Player Activity</CardTitle>
                    <CardDescription>Concurrent players over 24 h</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={playerActivityConfig}>
                      <AreaChart data={playerActivityData} margin={{ left: -16, right: 8 }}>
                        <defs>
                          <linearGradient id="fillPlayers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-players)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-players)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="players"
                          stroke="var(--color-players)"
                          strokeWidth={2}
                          fill="url(#fillPlayers)"
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Bar — resource usage */}
                <Card data-frosted="true" className="overview-glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                    <CardDescription>CPU & memory per server</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={serverResourceConfig}>
                      <BarChart data={serverResourceData} margin={{ left: -16, right: 8 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="server" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="cpu" fill="var(--color-cpu)" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="mem" fill="var(--color-mem)" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

              </div>

              {/* Donut — server status */}
              <Card data-frosted="true" className="overview-glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Server Status Distribution</CardTitle>
                  <CardDescription>Across all servers in your account</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ChartContainer config={serverStatusConfig} className="aspect-square max-h-56 w-full">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                      <Pie
                        data={serverStatusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {serverStatusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </Section>

            <div className="h-8" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
