"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function StringInspectTool() {
  const [input, setInput] = useState("");

  const analysis = useMemo(() => {
    if (!input) return null;
    const bytes = new TextEncoder().encode(input);
    const lines = input.split("\n");
    const words = input.trim().split(/\s+/).filter(Boolean);
    const chineseChars = (input.match(/[一-鿿]/g) || []).length;
    const upperCase = (input.match(/[A-Z]/g) || []).length;
    const lowerCase = (input.match(/[a-z]/g) || []).length;
    const digits = (input.match(/[0-9]/g) || []).length;
    const spaces = (input.match(/\s/g) || []).length;
    const special = input.length - chineseChars - upperCase - lowerCase - digits - spaces;

    return {
      length: input.length,
      byteSize: bytes.length,
      lines: lines.length,
      words: words.length,
      chineseChars,
      upperCase,
      lowerCase,
      digits,
      spaces,
      special,
      reversed: [...input].reverse().join(""),
      utf8: Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" "),
      codePoints: [...input].map((c) => "U+" + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")).join(" "),
      chars: [...input],
    };
  }, [input]);

  return (
    <ToolLayout title="字符串分析器" description="字符详情、编码分析、长度统计">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">输入字符串</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="输入要分析的字符串..."
            className="w-full h-28 p-3 rounded-lg border font-mono text-sm resize-none"
            style={{ background: "var(--card)", borderColor: "var(--border)" }} />
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { label: "长度", value: analysis.length },
                { label: "字节", value: analysis.byteSize },
                { label: "行数", value: analysis.lines },
                { label: "单词", value: analysis.words },
                { label: "中文", value: analysis.chineseChars },
                { label: "大写", value: analysis.upperCase },
                { label: "小写", value: analysis.lowerCase },
                { label: "数字", value: analysis.digits },
                { label: "空格", value: analysis.spaces },
                { label: "特殊", value: analysis.special },
              ].map(({ label, value }) => (
                <div key={label} className="p-2 rounded-lg text-center" style={{ background: "var(--muted)" }}>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                  <p className="font-bold text-lg">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">反转</label>
                <div className="p-2 rounded-lg font-mono text-sm break-all" style={{ background: "var(--muted)" }}>{analysis.reversed}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">UTF-8 (Hex)</label>
                <div className="p-2 rounded-lg font-mono text-xs break-all" style={{ background: "var(--muted)" }}>{analysis.utf8}</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Unicode 码点</label>
                <div className="p-2 rounded-lg font-mono text-xs break-all" style={{ background: "var(--muted)" }}>{analysis.codePoints}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">逐字分析</label>
              <div className="flex flex-wrap gap-1">
                {analysis.chars.map((c, i) => (
                  <div key={i} className="flex flex-col items-center p-1 rounded border min-w-[2rem]"
                    style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                    <span className="text-lg">{c === " " ? "␣" : c === "\n" ? "↵" : c}</span>
                    <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                      {c.codePointAt(0)!.toString(16).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
