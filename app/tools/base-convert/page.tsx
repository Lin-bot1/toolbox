"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function BaseConvertTool() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);

  const results = useMemo(() => {
    const num = parseInt(input, fromBase);
    if (isNaN(num)) return null;
    return {
      bin: num.toString(2),
      oct: num.toString(8),
      dec: num.toString(10),
      hex: num.toString(16).toUpperCase(),
      custom: (base: number) => num.toString(base).toUpperCase(),
    };
  }, [input, fromBase]);

  return (
    <ToolLayout title="进制转换" description="HEX / 二进制 / 八进制 / 十进制 互转">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">输入进制</label>
            <div className="flex gap-1">
              {[2, 8, 10, 16].map((b) => (
                <button key={b} onClick={() => setFromBase(b)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                  style={{
                    borderColor: fromBase === b ? "var(--primary)" : "var(--border)",
                    background: fromBase === b ? "var(--primary)" : "var(--card)",
                    color: fromBase === b ? "white" : "var(--foreground)",
                  }}>{b}进制</button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">输入数值</label>
            <input value={input} onChange={(e) => setInput(e.target.value.trim())}
              placeholder="输入数值..."
              className="w-full p-2.5 rounded-lg border font-mono text-lg"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
        </div>

        {results ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "二进制 (Binary)", value: results.bin, base: 2 },
              { label: "八进制 (Octal)", value: results.oct, base: 8 },
              { label: "十进制 (Decimal)", value: results.dec, base: 10 },
              { label: "十六进制 (Hex)", value: results.hex, base: 16 },
            ].map(({ label, value, base }) => (
              <div key={base} className="p-4 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{label}</span>
                  <button onClick={() => navigator.clipboard.writeText(value)}
                    className="px-2 py-0.5 rounded text-xs border"
                    style={{ borderColor: "var(--border)" }}>复制</button>
                </div>
                <code className="font-mono text-lg break-all">{value}</code>
              </div>
            ))}
          </div>
        ) : input && (
          <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>
            无法解析输入值，请确认输入的数值与选择的进制匹配
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
