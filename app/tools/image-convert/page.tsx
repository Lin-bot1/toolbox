"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

type Format = "image/png" | "image/jpeg" | "image/webp";

const formatLabels: Record<Format, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPEG",
  "image/webp": "WebP",
};

export default function ImageConvert() {
  const [targetFormat, setTargetFormat] = useState<Format>("image/webp");
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setProcessing(true);
      setResults([]);
      const newResults: { name: string; url: string }[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const bitmap = await createImageBitmap(file);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        const blob = await canvas.convertToBlob({ type: targetFormat });
        const ext = formatLabels[targetFormat].toLowerCase();
        const baseName = file.name.replace(/\.[^.]+$/, "");
        newResults.push({
          name: `${baseName}.${ext}`,
          url: URL.createObjectURL(blob),
        });
      }

      setResults(newResults);
      setProcessing(false);
    },
    [targetFormat]
  );

  return (
    <ToolLayout title="图片格式转换" description="JPG/PNG/WebP 互转，本地处理不上传">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">目标格式</label>
          <div className="flex gap-2">
            {(Object.keys(formatLabels) as Format[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setTargetFormat(fmt)}
                className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                style={{
                  borderColor: targetFormat === fmt ? "var(--primary)" : "var(--border)",
                  background: targetFormat === fmt ? "var(--primary)" : "var(--card)",
                  color: targetFormat === fmt ? "white" : "var(--foreground)",
                }}
              >
                {formatLabels[fmt]}
              </button>
            ))}
          </div>
        </div>

        <div
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("cv-input")?.click()}
        >
          <input id="cv-input" type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <div className="text-4xl mb-3">🔄</div>
          <p className="font-medium">拖拽图片到这里，或点击选择文件</p>
        </div>

        {processing && <div className="text-center py-4"><div className="inline-block animate-spin text-2xl">⏳</div></div>}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">转换结果</h3>
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between flex-wrap gap-2 p-4 rounded-lg border"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <p className="font-medium truncate min-w-0">{r.name}</p>
                <a href={r.url} download={r.name}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ background: "var(--primary)" }}>下载</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
