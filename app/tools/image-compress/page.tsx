"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface FileResult {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(2) + " MB";
}

export default function ImageCompress() {
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<FileResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setProcessing(true);
      setResults([]);
      const newResults: FileResult[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        const bitmap = await createImageBitmap(file);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);

        const blob = await canvas.convertToBlob({
          type: "image/jpeg",
          quality: quality / 100,
        });

        const url = URL.createObjectURL(blob);
        newResults.push({
          name: file.name,
          originalSize: file.size,
          compressedSize: blob.size,
          url,
        });
      }

      setResults(newResults);
      setProcessing(false);
    },
    [quality]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <ToolLayout title="图片压缩" description="在线压缩图片，支持 JPG/PNG/WebP，全部本地处理">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            压缩质量: {quality}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-blue-400"
          style={{ borderColor: "var(--border)" }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="text-4xl mb-3">📁</div>
          <p className="font-medium">拖拽图片到这里，或点击选择文件</p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            支持 JPG、PNG、WebP 格式
          </p>
        </div>

        {processing && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin text-2xl">⏳</div>
            <p className="mt-2">正在压缩...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">压缩结果</h3>
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between flex-wrap gap-2 p-4 rounded-lg border"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {formatSize(r.originalSize)} → {formatSize(r.compressedSize)}
                    <span className="ml-2 text-green-600 font-medium">
                      减少 {((1 - r.compressedSize / r.originalSize) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
                <a
                  href={r.url}
                  download={`compressed-${r.name}`}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ background: "var(--primary)" }}
                >
                  下载
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
