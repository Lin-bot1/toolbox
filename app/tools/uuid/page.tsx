"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

function v4(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  arr[6] = (arr[6] & 0x0f) | 0x40;
  arr[8] = (arr[8] & 0x3f) | 0x80;
  const hex = Array.from(arr, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

export default function UuidTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDash, setNoDash] = useState(false);

  const generate = useCallback(() => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let u = v4();
      if (uppercase) u = u.toUpperCase();
      if (noDash) u = u.replace(/-/g, "");
      result.push(u);
    }
    setUuids(result);
  }, [count, uppercase, noDash]);

  const copyAll = () => navigator.clipboard.writeText(uuids.join("\n"));

  return (
    <ToolLayout title="UUID 生成器" description="生成随机 UUID v4 唯一标识符">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">生成数量</label>
            <input type="number" min={1} max={100} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            大写
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={noDash} onChange={(e) => setNoDash(e.target.checked)} />
            去除横杠
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={generate}
            className="px-6 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>生成 UUID</button>
          {uuids.length > 0 && (
            <button onClick={copyAll}
              className="px-4 py-2.5 rounded-lg text-sm font-medium border"
              style={{ borderColor: "var(--border)" }}>复制全部</button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="space-y-1">
            {uuids.map((u, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <span className="text-xs w-6 shrink-0" style={{ color: "var(--muted-foreground)" }}>{i + 1}</span>
                <code className="flex-1 font-mono text-sm break-all">{u}</code>
                <button onClick={() => navigator.clipboard.writeText(u)}
                  className="px-2 py-1 rounded text-xs border shrink-0"
                  style={{ borderColor: "var(--border)" }}>复制</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
