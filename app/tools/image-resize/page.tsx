"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageResizeTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const bitmap = await createImageBitmap(file);
    setOrigW(bitmap.width);
    setOrigH(bitmap.height);
    setWidth(bitmap.width);
    setHeight(bitmap.height);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  const changeWidth = (v: number) => {
    setWidth(v);
    if (keepRatio && origW > 0) setHeight(Math.round(v * origH / origW));
  };

  const changeHeight = (v: number) => {
    setHeight(v);
    if (keepRatio && origH > 0) setWidth(Math.round(v * origW / origH));
  };

  const download = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resized.${format.split("/")[1]}`;
      a.click();
    }, format);
  };

  return (
    <ToolLayout title="图片裁剪/调整尺寸" description="按像素精确调整图片大小">
      <div className="space-y-6">
        {!imageUrl ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400"
            style={{ borderColor: "var(--border)" }}
            onClick={() => document.getElementById("resize-input")?.click()}>
            <input id="resize-input" type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="text-4xl mb-3">📐</div>
            <p className="font-medium">点击选择图片</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">宽度 (px)</label>
                <input type="number" min={1} value={width} onChange={(e) => changeWidth(Number(e.target.value))}
                  className="w-28 p-2 rounded-lg border text-sm font-mono"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }} />
              </div>
              <div className="text-xl pb-2">×</div>
              <div>
                <label className="block text-sm font-medium mb-1">高度 (px)</label>
                <input type="number" min={1} value={height} onChange={(e) => changeHeight(Number(e.target.value))}
                  className="w-28 p-2 rounded-lg border text-sm font-mono"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }} />
              </div>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer pb-2">
                <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />
                保持比例
              </label>
            </div>

            <div className="flex gap-2">
              {(["image/png", "image/jpeg", "image/webp"] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                  style={{
                    borderColor: format === f ? "var(--primary)" : "var(--border)",
                    background: format === f ? "var(--primary)" : "var(--card)",
                    color: format === f ? "white" : "var(--foreground)",
                  }}>
                  {f.split("/")[1].toUpperCase()}
                </button>
              ))}
              <button onClick={download}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white"
                style={{ background: "var(--primary)" }}>下载</button>
              <button onClick={() => { setImageUrl(""); setWidth(0); setHeight(0); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                style={{ borderColor: "var(--border)" }}>重新选择</button>
            </div>

            <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              原始: {origW} × {origH} → 调整后: {width} × {height}
            </div>

            <div className="flex justify-center">
              <canvas ref={canvasRef} className="max-w-full border rounded-lg" style={{ borderColor: "var(--border)" }} />
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
