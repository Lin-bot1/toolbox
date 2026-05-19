"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

type Tab = "stopwatch" | "timer";

export default function TimerTool() {
  const [tab, setTab] = useState<Tab>("stopwatch");

  // Stopwatch
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = useRef<number>(0);
  const swStartRef = useRef<number>(0);

  const startSw = useCallback(() => {
    swStartRef.current = Date.now() - swTime;
    swRef.current = window.setInterval(() => {
      setSwTime(Date.now() - swStartRef.current);
    }, 10);
    setSwRunning(true);
  }, [swTime]);

  const stopSw = useCallback(() => {
    clearInterval(swRef.current);
    setSwRunning(false);
  }, []);

  const resetSw = useCallback(() => {
    clearInterval(swRef.current);
    setSwTime(0);
    setSwRunning(false);
  }, []);

  // Countdown
  const [cdInput, setCdInput] = useState({ h: 0, m: 5, s: 0 });
  const [cdTime, setCdTime] = useState(0);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdDone, setCdDone] = useState(false);
  const cdRef = useRef<number>(0);

  const startCd = useCallback(() => {
    const total = (cdInput.h * 3600 + cdInput.m * 60 + cdInput.s) * 1000;
    if (total <= 0) return;
    setCdTime(total);
    setCdDone(false);
    const start = Date.now();
    cdRef.current = window.setInterval(() => {
      setCdTime((prev) => {
        const elapsed = Date.now() - start;
        const remaining = total - elapsed;
        if (remaining <= 0) {
          clearInterval(cdRef.current);
          setCdRunning(false);
          setCdDone(true);
          return 0;
        }
        return remaining;
      });
    }, 100);
    setCdRunning(true);
  }, [cdInput]);

  const stopCd = useCallback(() => {
    clearInterval(cdRef.current);
    setCdRunning(false);
  }, []);

  const resetCd = useCallback(() => {
    clearInterval(cdRef.current);
    setCdTime(0);
    setCdRunning(false);
    setCdDone(false);
  }, []);

  useEffect(() => {
    return () => { clearInterval(swRef.current); clearInterval(cdRef.current); };
  }, []);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
  };

  return (
    <ToolLayout title="秒表/计时器" description="在线计时、倒计时">
      <div className="space-y-6">
        <div className="flex gap-2">
          {(["stopwatch", "timer"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: tab === t ? "var(--primary)" : "var(--border)",
                background: tab === t ? "var(--primary)" : "var(--card)",
                color: tab === t ? "white" : "var(--foreground)",
              }}>
              {t === "stopwatch" ? "秒表" : "倒计时"}
            </button>
          ))}
        </div>

        {tab === "stopwatch" ? (
          <div className="text-center space-y-6">
            <div className="font-mono text-4xl sm:text-6xl font-bold tracking-wider py-8">
              {formatTime(swTime)}
            </div>
            <div className="flex justify-center gap-4">
              {!swRunning ? (
                <button onClick={startSw} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
                  style={{ background: "#22c55e" }}>开始</button>
              ) : (
                <button onClick={stopSw} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
                  style={{ background: "#ef4444" }}>暂停</button>
              )}
              <button onClick={resetSw} className="px-8 py-3 rounded-xl text-lg font-medium border"
                style={{ borderColor: "var(--border)" }}>重置</button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            {!cdRunning && cdTime === 0 && !cdDone && (
              <div className="flex justify-center gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">时</label>
                  <input type="number" min={0} max={99} value={cdInput.h}
                    onChange={(e) => setCdInput({ ...cdInput, h: Number(e.target.value) })}
                    className="w-16 sm:w-20 p-3 rounded-lg border text-center text-2xl font-mono"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }} />
                </div>
                <span className="text-2xl pb-3">:</span>
                <div>
                  <label className="block text-sm font-medium mb-1">分</label>
                  <input type="number" min={0} max={59} value={cdInput.m}
                    onChange={(e) => setCdInput({ ...cdInput, m: Number(e.target.value) })}
                    className="w-16 sm:w-20 p-3 rounded-lg border text-center text-2xl font-mono"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }} />
                </div>
                <span className="text-2xl pb-3">:</span>
                <div>
                  <label className="block text-sm font-medium mb-1">秒</label>
                  <input type="number" min={0} max={59} value={cdInput.s}
                    onChange={(e) => setCdInput({ ...cdInput, s: Number(e.target.value) })}
                    className="w-16 sm:w-20 p-3 rounded-lg border text-center text-2xl font-mono"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }} />
                </div>
              </div>
            )}

            <div className={`font-mono text-4xl sm:text-6xl font-bold tracking-wider py-8 ${cdDone ? "text-red-500" : ""}`}>
              {formatTime(cdTime)}
              {cdDone && <div className="text-2xl mt-2">时间到！</div>}
            </div>

            <div className="flex justify-center gap-4">
              {!cdRunning && cdTime === 0 ? (
                <button onClick={startCd} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
                  style={{ background: "#22c55e" }}>开始</button>
              ) : cdRunning ? (
                <button onClick={stopCd} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
                  style={{ background: "#ef4444" }}>暂停</button>
              ) : (
                <button onClick={startCd} className="px-8 py-3 rounded-xl text-white text-lg font-medium"
                  style={{ background: "#22c55e" }}>继续</button>
              )}
              <button onClick={resetCd} className="px-8 py-3 rounded-xl text-lg font-medium border"
                style={{ borderColor: "var(--border)" }}>重置</button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
