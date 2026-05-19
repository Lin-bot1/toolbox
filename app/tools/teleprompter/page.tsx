"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TeleprompterTool() {
  const [text, setText] = useState("在这里输入你的演讲稿...\n\n每一行会自动换行。\n\n点击「开始」按钮进入全屏提词模式。\n\n在提词模式下：\n- 点击左半边暂停/继续\n- 点击右半边加速\n- 按 ESC 退出");
  const [speed, setSpeed] = useState(3);
  const [fontSize, setFontSize] = useState(48);
  const [mirror, setMirror] = useState(false);
  const [running, setRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

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

  useEffect(() => {
    if (!running || !containerRef.current) return;
    let animId: number;
    const container = containerRef.current;
    const scroll = () => {
      container.scrollTop += speedRef.current * 0.3;
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [running]);

  const handleClick = (e: React.MouseEvent) => {
    if (!running) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.3) {
      setSpeed((s) => (s === 0 ? 3 : 0));
    } else {
      setSpeed((s) => Math.min(s + 1, 15));
    }
  };

  if (running) {
    return (
      <div ref={containerRef} onClick={handleClick}
        className="fixed inset-0 bg-black text-white overflow-auto cursor-none z-50"
        style={{ transform: mirror ? "scaleX(-1)" : "none" }}>
        <div className="px-6 sm:px-20 py-[80vh] min-h-screen flex items-center justify-center">
          <p className="text-center leading-relaxed whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
            {text}
          </p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); stop(); }}
          className="fixed top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white border border-white/30 hover:border-white transition-all z-50"
          style={{ transform: mirror ? "scaleX(-1)" : "none" }}>
          ✕
        </button>
        <div className="fixed bottom-4 left-4 text-sm text-white/30"
          style={{ transform: mirror ? "scaleX(-1)" : "none" }}>
          速度: {speed} | {speed === 0 ? "已暂停" : "滚动中"} | 点击左半边暂停/继续，右半边加速
        </div>
      </div>
    );
  }

  return (
    <ToolLayout title="提词器" description="全屏滚动文本，录视频/直播用">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium mb-1.5">字体大小: {fontSize}px</label>
            <input type="range" min={24} max={96} value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium mb-1.5">初始速度: {speed}</label>
            <input type="range" min={1} max={10} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500" />
            镜像翻转
          </label>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 rounded-xl border-2 text-sm resize-none focus:outline-none transition-colors"
          style={{ background: "var(--card)", borderColor: "var(--border)" }} />

        <button onClick={start}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all active:scale-95"
          style={{ background: "var(--primary)" }}>
          开始提词 (全屏)
        </button>

        <div className="p-4 rounded-xl text-sm border" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
          <p className="font-medium mb-1.5">使用说明</p>
          <p style={{ color: "var(--muted-foreground)" }}>
            点击「开始」进入全屏模式。提词时点击屏幕左半边暂停/继续，点击右半边加速。按 ESC 退出。镜像翻转适合搭配提词器硬件使用。
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
