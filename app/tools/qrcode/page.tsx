"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function QrCodeTool() {
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text || !canvasRef.current) return;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvasRef.current!, text, { width: size, margin: 2, color: { dark: "#000000", light: "#ffffff" } });
      } catch { /* ignore */ }
    })();
  }, [text, size]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <ToolLayout title="二维码生成" description="输入文本或链接生成二维码图片">
      <div className="space-y-6 animate-fade-in">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>文本或链接</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="输入文本或 URL..."
            className="w-full h-24 font-mono text-sm resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
            尺寸: <span style={{ color: "var(--primary)" }}>{size}px</span>
          </label>
          <input type="range" min={128} max={512} step={32} value={size}
            onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
        </div>

        <div className="flex justify-center">
          <div className="p-5 rounded-[var(--radius)] border inline-block"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)", boxShadow: "var(--shadow-card)" }}>
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>

        <div className="text-center">
          <button onClick={download}
            className="px-6 py-2.5 rounded-[var(--radius)] text-white text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--primary)" }}>
            下载二维码
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
