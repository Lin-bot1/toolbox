"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

type Phase = "work" | "break" | "longBreak";

export default function PomodoroTool() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);
  const [sessions, setSessions] = useState(0);
  const [phase, setPhase] = useState<Phase>("work");
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number>(0);
  const endRef = useRef<number>(0);

  const durations: Record<Phase, number> = {
    work: workMin * 60 * 1000,
    break: breakMin * 60 * 1000,
    longBreak: longBreakMin * 60 * 1000,
  };

  const start = useCallback(() => {
    endRef.current = Date.now() + remaining;
    timerRef.current = window.setInterval(() => {
      const left = endRef.current - Date.now();
      if (left <= 0) {
        clearInterval(timerRef.current);
        setRunning(false);
        setRemaining(0);
        if (phase === "work") {
          const s = sessions + 1;
          setSessions(s);
          if (s % 4 === 0) {
            setPhase("longBreak");
            setRemaining(longBreakMin * 60 * 1000);
          } else {
            setPhase("break");
            setRemaining(breakMin * 60 * 1000);
          }
        } else {
          setPhase("work");
          setRemaining(workMin * 60 * 1000);
        }
        return;
      }
      setRemaining(left);
    }, 200);
    setRunning(true);
  }, [remaining, phase, sessions, workMin, breakMin, longBreakMin]);

  const pause = useCallback(() => {
    clearInterval(timerRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setRunning(false);
    setPhase("work");
    setRemaining(durations.work);
    setSessions(0);
  }, [durations.work]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const total = durations[phase];
  const progress = total > 0 ? (total - remaining) / total : 0;

  const phaseLabels: Record<Phase, string> = { work: "专注", break: "短休息", longBreak: "长休息" };
  const phaseColors: Record<Phase, string> = { work: "#ef4444", break: "#22c55e", longBreak: "#3b82f6" };

  return (
    <ToolLayout title="番茄钟" description="25分钟专注计时">
      <div className="space-y-6 text-center">
        <div className="flex justify-center gap-2">
          {(["work", "break", "longBreak"] as const).map((p) => (
            <button key={p} onClick={() => { if (!running) { setPhase(p); setRemaining(durations[p]); } }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{
                borderColor: phase === p ? phaseColors[p] : "var(--border)",
                background: phase === p ? phaseColors[p] : "var(--card)",
                color: phase === p ? "white" : "var(--foreground)",
              }}>
              {phaseLabels[p]}
            </button>
          ))}
        </div>

        <div className="relative inline-block">
          <svg width="240" height="240" className="-rotate-90">
            <circle cx="120" cy="120" r="100" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="120" cy="120" r="100" fill="none" stroke={phaseColors[phase]} strokeWidth="8"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progress)}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl md:text-5xl font-mono font-bold">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
            <span className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{phaseLabels[phase]}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!running ? (
            <button onClick={start} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
              style={{ background: phaseColors[phase] }}>开始</button>
          ) : (
            <button onClick={pause} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
              style={{ background: "#f59e0b" }}>暂停</button>
          )}
          <button onClick={reset} className="px-8 py-3 rounded-xl text-lg font-medium border"
            style={{ borderColor: "var(--border)" }}>重置</button>
        </div>

        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs"
              style={{
                borderColor: sessions >= i ? phaseColors.work : "var(--border)",
                background: sessions >= i ? phaseColors.work : "transparent",
                color: sessions >= i ? "white" : "var(--muted-foreground)",
              }}>{i}</div>
          ))}
          <span className="ml-2 text-sm self-center" style={{ color: "var(--muted-foreground)" }}>
            已完成 {sessions} 个番茄
          </span>
        </div>

        {!running && phase === "work" && remaining === durations.work && (
          <div className="flex justify-center gap-4 text-sm flex-wrap">
            <label>专注 <input type="number" min={1} max={60} value={workMin}
              onChange={(e) => { setWorkMin(Number(e.target.value)); setRemaining(Number(e.target.value) * 60000); }}
              className="w-14 p-1 rounded border text-center text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} /> 分</label>
            <label>短休 <input type="number" min={1} max={30} value={breakMin}
              onChange={(e) => setBreakMin(Number(e.target.value))}
              className="w-14 p-1 rounded border text-center text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} /> 分</label>
            <label>长休 <input type="number" min={1} max={60} value={longBreakMin}
              onChange={(e) => setLongBreakMin(Number(e.target.value))}
              className="w-14 p-1 rounded border text-center text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} /> 分</label>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
