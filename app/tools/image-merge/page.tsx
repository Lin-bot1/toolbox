"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageMergeTool() {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [gap, setGap] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: FileList) => {
    const newImages = Array.from(files).map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const merge = useCallback(async () => {
    if (images.length === 0 || !canvasRef.current) return;

    const bitmaps = await Promise.all(
      images.map(async (img) => {
        const r = await fetch(img.url);
        const blob = await r.blob();
        return createImageBitmap(blob);
      })
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    if (direction === "horizontal") {
      const totalWidth = bitmaps.reduce((s, b) => s + b.width, 0) + gap * (bitmaps.length - 1);
      const maxHeight = Math.max(...bitmaps.map((b) => b.height));
      canvas.width = totalWidth;
      canvas.height = maxHeight;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalWidth, maxHeight);
      let x = 0;
      bitmaps.forEach((b) => {
        ctx.drawImage(b, x, 0);
        x += b.width + gap;
      });
    } else {
      const totalHeight = bitmaps.reduce((s, b) => s + b.height, 0) + gap * (bitmaps.length - 1);
      const maxWidth = Math.max(...bitmaps.map((b) => b.width));
      canvas.width = maxWidth;
      canvas.height = totalHeight;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, maxWidth, totalHeight);
      let y = 0;
      bitmaps.forEach((b) => {
        ctx.drawImage(b, 0, y);
        y += b.height + gap;
      });
    }
  }, [images, direction, gap, bgColor]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "merged.png";
    a.click();
  };

  const remove = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => {
    if (i === 0) return;
    setImages((prev) => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };

  return (
    <ToolLayout title="图片拼接" description="多张图片横/纵向拼接">
      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-400"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("merge-input")?.click()}>
          <input id="merge-input" type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <div className="text-3xl mb-2">🧩</div>
          <p className="text-sm">点击选择图片（可多选）</p>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img.url} alt={img.name} className="h-20 rounded border object-cover"
                  style={{ borderColor: "var(--border)" }} />
                <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100">
                  {i > 0 && <button onClick={() => moveUp(i)} className="bg-black/60 text-white text-xs px-1">←</button>}
                  <button onClick={() => remove(i)} className="bg-red-500 text-white text-xs px-1">×</button>
                </div>
                <p className="text-xs text-center mt-0.5 truncate max-w-[80px]">{i + 1}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex gap-2">
            {(["horizontal", "vertical"] as const).map((d) => (
              <button key={d} onClick={() => setDirection(d)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: direction === d ? "var(--primary)" : "var(--border)",
                  background: direction === d ? "var(--primary)" : "var(--card)",
                  color: direction === d ? "white" : "var(--foreground)",
                }}>{d === "horizontal" ? "横向" : "纵向"}</button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">间距: {gap}px</label>
            <input type="range" min={0} max={50} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-24" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">背景色</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-8 rounded cursor-pointer border-0" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={merge} disabled={images.length < 2}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--primary)" }}>拼接</button>
          <button onClick={download}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)" }}>下载</button>
        </div>

        <div className="flex justify-center overflow-auto">
          <canvas ref={canvasRef} className="max-w-full border rounded-lg" style={{ borderColor: "var(--border)" }} />
        </div>
      </div>
    </ToolLayout>
  );
}
