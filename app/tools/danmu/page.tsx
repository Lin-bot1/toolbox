"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function DanmuTool() {
  const [text, setText] = useState("接人专用");
  const [color, setColor] = useState("#ff0000");
  const [bgColor, setBgColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(120);
  const [speed, setSpeed] = useState(3);
  const [running, setRunning] = useState(false);
  const [direction, setDirection] = useState<"scroll" | "blink">("scroll");
  const containerRef = useRef<HTMLDivElement>(null);

  const stop = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    }, 50);
  }, []);

  useEffect(() => {
    if (!running) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    const onFsChange = () => {
      if (!document.fullscreenElement) setRunning(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [running, stop]);

  if (running) {
    return (
      <div ref={containerRef} className="fixed inset-0 flex items-center justify-center overflow-hidden z-50"
        style={{ background: bgColor, cursor: "pointer" }}
        onClick={() => setSpeed((s) => (s === 0 ? 3 : 0))}>
        {direction === "scroll" ? (
          <div className="whitespace-nowrap animate-[scroll_10s_linear_infinite]"
            style={{
              color, fontSize: `${fontSize}px`, fontWeight: "bold",
              animationDuration: `${20 / speed}s`,
              animationPlayState: speed === 0 ? "paused" : "running",
            }}>
            <style>{`@keyframes scroll { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }`}</style>
            {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text}
          </div>
        ) : (
          <div className={speed === 0 ? "" : "animate-[blink_1s_ease-in-out_infinite]"}
            style={{ color, fontSize: `${fontSize}px`, fontWeight: "bold" }}>
            <style>{`@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
            {text}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); stop(); }}
          className="fixed top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl opacity-50 hover:opacity-100 transition-opacity"
          style={{ color, border: `2px solid ${color}` }}>
          ✕
        </button>
        <div className="fixed bottom-4 left-4 text-sm opacity-30" style={{ color }}>
          点击暂停/继续 | ESC 退出
        </div>
      </div>
    );
  }

  return (
    <ToolLayout title="手持弹幕" description="大字 LED 滚动，接人/应援用">
      <div className="space-y-6">
        <input value={text} onChange={(e) => setText(e.target.value)}
          placeholder="输入弹幕文字..."
          className="w-full p-4 rounded-xl border-2 text-2xl text-center font-bold focus:outline-none transition-colors"
          style={{ background: "var(--card)", borderColor: "var(--border)" }} />

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1.5">文字颜色</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border-0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">背景颜色</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border-0" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium mb-1.5">字体大小: {fontSize}px</label>
            <input type="range" min={48} max={300} value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium mb-1.5">速度: {speed}</label>
            <input type="range" min={1} max={10} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
        </div>

        <div className="flex gap-2">
          {(["scroll", "blink"] as const).map((d) => (
            <button key={d} onClick={() => setDirection(d)}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
              style={{
                borderColor: direction === d ? "var(--primary)" : "var(--border)",
                background: direction === d ? "var(--primary)" : "var(--card)",
                color: direction === d ? "white" : "var(--foreground)",
              }}>
              {d === "scroll" ? "滚动" : "闪烁"}
            </button>
          ))}
        </div>

        <div className="h-32 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner"
          style={{ background: bgColor }}>
          <span className="whitespace-nowrap font-bold" style={{ color, fontSize: "48px" }}>{text}</span>
        </div>

        <button onClick={start}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all active:scale-95"
          style={{ background: "var(--primary)" }}>
          开始 (全屏)
        </button>
      </div>
    </ToolLayout>
  );
}
