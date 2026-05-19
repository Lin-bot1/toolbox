"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function Base64Tool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [imgPreview, setImgPreview] = useState("");

  const encode = () => {
    try { setResult(btoa(unescape(encodeURIComponent(text)))); }
    catch (e) { setResult("编码失败: " + (e as Error).message); }
  };

  const decode = () => {
    try { setResult(decodeURIComponent(escape(atob(text.trim())))); }
    catch { setResult("解码失败: 无效的 Base64 字符串"); }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImgPreview(dataUrl);
      setResult(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout title="Base64 编解码" description="文本与 Base64 互转，支持图片转码">
      <div className="space-y-5">
        {/* Mode tabs */}
        <div className="inline-flex rounded-[var(--radius)] p-1 border" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
          {(["encode", "decode"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-1.5 rounded-[var(--radius-xs)] text-sm font-medium transition-all duration-150"
              style={{
                background: mode === m ? "var(--primary)" : "transparent",
                color: mode === m ? "white" : "var(--fg-muted)",
              }}>
              {m === "encode" ? "编码" : "解码"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
            {mode === "encode" ? "输入文本" : "输入 Base64"}
          </label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入要解码的 Base64..."}
            className="w-full h-40 font-mono text-sm resize-none" />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={mode === "encode" ? encode : decode}
            className="px-5 py-2 rounded-[var(--radius-xs)] text-sm font-medium text-white transition-all duration-150 active:scale-95"
            style={{ background: "var(--primary)" }}>
            {mode === "encode" ? "编码" : "解码"}
          </button>
          {mode === "encode" && (
            <label className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border cursor-pointer transition-colors"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              图片转 Base64
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
            </label>
          )}
          {result && (
            <button onClick={() => navigator.clipboard.writeText(result)}
              className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border transition-colors"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              复制
            </button>
          )}
          <button onClick={() => { setText(""); setResult(""); setImgPreview(""); }}
            className="px-4 py-2 rounded-[var(--radius-xs)] text-sm font-medium border transition-colors"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            清空
          </button>
        </div>

        {imgPreview && (
          <div className="p-4 rounded-[var(--radius)] border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>预览</p>
            <img src={imgPreview} alt="preview" className="max-w-full max-h-48 rounded-lg" />
          </div>
        )}

        {result && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>结果</label>
            <textarea value={result} readOnly className="w-full h-40 font-mono text-sm resize-none"
              style={{ background: "var(--bg-muted)" }} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
