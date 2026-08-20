import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gauge,
  Leaf,
  ShieldAlert,
  Signal,
  Sparkles,
  Timer,
  Train,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SECTIONS, TRAINS, type TrainStatus } from "@/components/pathfinder/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PATHFINDER — AI Railway Traffic Control" },
      {
        name: "description",
        content:
          "PATHFINDER is an AI railway dispatching console: live section topology, conflict detection and throughput analytics for control rooms.",
      },
      { property: "og:title", content: "PATHFINDER — AI Railway Traffic Control" },
      {
        property: "og:description",
        content:
          "Monitor section occupancy, resolve train conflicts and maximise throughput with AI dispatch recommendations.",
      },
    ],
  }),
  component: Pathfinder,
});

const statusRing: Record<TrainStatus, string> = {
  flow: "bg-flow shadow-[0_0_12px_var(--flow)]",
  warn: "bg-warn shadow-[0_0_12px_var(--warn)]",
  critical: "bg-critical shadow-[0_0_14px_var(--critical)]",
};

const statusText: Record<TrainStatus, string> = {
  flow: "text-flow",
  warn: "text-warn",
  critical: "text-critical",
};

function Dot({ status }: { status: TrainStatus }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${statusRing[status]}`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${statusRing[status]}`} />
    </span>
  );
}

function Pathfinder() {
  const [resolved, setResolved] = useState(false);
  const [autopilot, setAutopilot] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);

  const throughput = resolved ? 24 : 18;
  const trains = useMemo(
    () =>
      TRAINS.map((t) =>
        resolved && t.status === "critical"
          ? {
              ...t,
              status: "flow" as TrainStatus,
              speed: t.id === "FRT-802" ? 46 : 104,
              delay: t.id === "FRT-802" ? 4 : 0,
            }
          : t,
      ),
    [resolved],
  );

  const sections = useMemo(
    () =>
      SECTIONS.map((s) =>
        resolved && s.conflict
          ? { ...s, conflict: false, signal: "Green" as const, utilisation: 78 }
          : s,
      ),
    [resolved],
  );

  const kpis = [
    {
      icon: Timer,
      label: "Avg Section Clearance",
      value: resolved ? "6.2" : "8.4",
      unit: "min",
      delta: resolved ? "-2.2 min" : "+0.6 min",
      good: resolved,
    },
    {
      icon: Train,
      label: "Trains Passed / Hour",
      value: resolved ? "27" : "22",
      unit: "tph",
      delta: resolved ? "+5 tph" : "-1 tph",
      good: resolved,
    },
    {
      icon: Leaf,
      label: "Energy Savings",
      value: resolved ? "14.8" : "9.3",
      unit: "%",
      delta: resolved ? "+5.5%" : "+0.4%",
      good: true,
    },
    {
      icon: Gauge,
      label: "Punctuality Index",
      value: resolved ? "94.1" : "86.7",
      unit: "%",
      delta: resolved ? "+7.4%" : "-1.9%",
      good: resolved,
    },
  ];

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary glow-flow">
              <Train className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-[0.22em]">PATHFINDER</h1>
              <p className="text-[11px] text-muted-foreground">Precise Train Traffic Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <Cpu className={`h-3.5 w-3.5 ${autopilot ? "text-flow" : "text-muted-foreground"}`} />
            <span className="text-xs">
              AI Auto-Pilot {autopilot ? "Active" : "Standby"}
            </span>
            {autopilot && <Dot status="flow" />}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-flow/40 bg-flow/10 px-3 py-1.5 text-flow">
            <Activity className="h-3.5 w-3.5" />
            <span className="font-mono text-xs text-tabular">+{throughput}% Throughput Index</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <Signal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono text-xs text-tabular">{trains.length} Active Trains</span>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Autopilot</span>
              <Switch checked={autopilot} onCheckedChange={setAutopilot} />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <ShieldAlert
                className={`h-4 w-4 ${manualOverride ? "text-critical" : "text-muted-foreground"}`}
              />
              <span className={manualOverride ? "text-critical" : "text-muted-foreground"}>
                Manual Override
              </span>
              <Switch checked={manualOverride} onCheckedChange={setManualOverride} />
            </label>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Topology */}
          <section className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Live Section Topology</h2>
                <p className="text-[11px] text-muted-foreground">
                  Howrah — Kharagpur corridor · Sections A through F
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Dot status="flow" /> On time</span>
                <span className="flex items-center gap-1.5"><Dot status="warn" /> Delayed</span>
                <span className="flex items-center gap-1.5"><Dot status="critical" /> Conflict</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {sections.map((s) => {
                const inSection = trains.filter((t) => t.section === s.id);
                return (
                  <div
                    key={s.id}
                    className={`px-4 py-4 transition-colors ${
                      s.conflict ? "bg-critical/10" : "hover:bg-accent/40"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-[11px] text-tabular ${
                          s.conflict
                            ? "border-critical/50 bg-critical/15 text-critical"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {s.id}
                      </span>
                      <span className="text-sm">{s.label}</span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.line} line
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-[11px] ${
                          s.signal === "Green" ? "text-flow" : "text-critical"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            s.signal === "Green"
                              ? "bg-flow shadow-[0_0_10px_var(--flow)]"
                              : "bg-critical shadow-[0_0_10px_var(--critical)] animate-pulse"
                          }`}
                        />
                        {s.signal} signal
                      </span>
                      <span className="ml-auto font-mono text-[11px] text-tabular text-muted-foreground">
                        util {s.utilisation}% · occ {inSection.length}
                      </span>
                    </div>

                    {/* track */}
                    <div
                      className={`relative h-12 rounded-md border ${
                        s.conflict
                          ? "border-critical/50 glow-critical"
                          : "border-border"
                      } bg-background/60`}
                    >
                      <div className="absolute inset-x-3 top-1/2 h-px -translate-y-[5px] bg-rail" />
                      {s.line === "Double" && (
                        <div className="absolute inset-x-3 top-1/2 h-px translate-y-[5px] bg-rail" />
                      )}
                      {inSection.map((t, i) => (
                        <div
                          key={t.id}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${Math.min(92, Math.max(8, t.position))}%`,
                            top: s.line === "Double" && i % 2 === 1 ? "72%" : "28%",
                          }}
                        >
                          <div
                            className={`flex items-center gap-1.5 rounded-full border px-2 py-1 ${
                              t.status === "critical"
                                ? "border-critical/60 bg-critical/15"
                                : t.status === "warn"
                                  ? "border-warn/50 bg-warn/10"
                                  : "border-flow/40 bg-flow/10"
                            }`}
                          >
                            <Dot status={t.status} />
                            <span className={`font-mono text-[10px] text-tabular ${statusText[t.status]}`}>
                              {t.id}
                            </span>
                            <span className="font-mono text-[10px] text-tabular text-muted-foreground">
                              {t.speed} km/h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Copilot */}
          <aside className="space-y-5">
            <section
              className={`rounded-lg border bg-card ${
                resolved ? "border-flow/40" : "border-critical/50 glow-critical"
              }`}
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">AI Dispatcher Copilot</h2>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    resolved
                      ? "bg-flow/15 text-flow"
                      : "bg-critical/15 text-critical animate-pulse"
                  }`}
                >
                  {resolved ? "Resolved" : "Conflict"}
                </span>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  {resolved ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-flow" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-critical" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {resolved
                        ? "Section SEC-C3 cleared"
                        : "Conflict detected — SEC-C3 (Single line)"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resolved
                        ? "Freight 802 held at Loop Line 2 for 4 min. Express 101 cleared the ghat section at 104 km/h."
                        : "Express 101 (up) and Freight 802 (down) converge on the single-line ghat section in 3 min 20 s."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-border bg-background/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Predicted delay
                    </p>
                    <p
                      className={`mt-1 font-mono text-xl text-tabular ${
                        resolved ? "text-flow" : "text-critical"
                      }`}
                    >
                      {resolved ? "+4" : "+15"} min
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-background/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Confidence
                    </p>
                    <p className="mt-1 font-mono text-xl text-tabular text-primary">
                      {resolved ? "99" : "96"}%
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-background/60 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    AI recommendation
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      Hold <span className="font-mono text-tabular">FRT-802</span> at Loop Line 2 for
                      4 min
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      Give priority to <span className="font-mono text-tabular">EXP-101</span> · velocity profile 104 km/h
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      Reroute switch <span className="font-mono text-tabular">SW-C3/07</span> to loop
                      after clearance
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  disabled={resolved || manualOverride}
                  onClick={() => setResolved(true)}
                >
                  <Sparkles className="h-4 w-4" />
                  {resolved ? "AI Resolution Applied" : "Approve AI Action"}
                </Button>
                {manualOverride && !resolved && (
                  <p className="text-center text-[11px] text-critical">
                    Manual override engaged — disable to apply AI resolutions.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold">Active Consist Board</h2>
              </div>
              <div className="divide-y divide-border">
                {trains.slice(0, 6).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                    <Dot status={t.status} />
                    <div className="min-w-0">
                      <p className="truncate text-xs">{t.name}</p>
                      <p className="font-mono text-[10px] text-tabular text-muted-foreground">
                        {t.section} · {t.type}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-mono text-xs text-tabular">{t.speed} km/h</p>
                      <p
                        className={`font-mono text-[10px] text-tabular ${
                          t.delay === 0 ? "text-flow" : statusText[t.status]
                        }`}
                      >
                        {t.delay === 0 ? "on time" : `+${t.delay} min`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* Analytics */}
        <section className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <k.icon className="h-4 w-4" />
                  <span className="text-[11px] uppercase tracking-wider">{k.label}</span>
                </div>
                <p className="mt-3 font-mono text-3xl text-tabular">
                  {k.value}
                  <span className="ml-1 text-sm text-muted-foreground">{k.unit}</span>
                </p>
                <p
                  className={`mt-1 font-mono text-[11px] text-tabular ${
                    k.good ? "text-flow" : "text-warn"
                  }`}
                >
                  {k.delta} vs last hour
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Section Utilisation</h2>
            <p className="text-[11px] text-muted-foreground">Rolling 60-minute window</p>
            <div className="mt-4 space-y-3">
              {sections.map((s) => (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-tabular">
                    <span className="text-muted-foreground">{s.id}</span>
                    <span
                      className={
                        s.utilisation > 90
                          ? "text-critical"
                          : s.utilisation > 70
                            ? "text-warn"
                            : "text-flow"
                      }
                    >
                      {s.utilisation}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        s.utilisation > 90
                          ? "bg-critical"
                          : s.utilisation > 70
                            ? "bg-warn"
                            : "bg-flow"
                      }`}
                      style={{ width: `${s.utilisation}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
