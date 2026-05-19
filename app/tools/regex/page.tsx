"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testStr) return { matches: [], error: "", highlighted: testStr };
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...testStr.matchAll(re)].map((m) => ({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
      }));

      let highlighted = testStr;
      if (flags.includes("g")) {
        highlighted = testStr.replace(re, (m) => `<<<MARK>>>${m}<<<END>>>`);
      } else {
        highlighted = testStr.replace(re, (m) => `<<<MARK>>>${m}<<<END>>>`);
      }

      return { matches, error: "", highlighted };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: testStr };
    }
  }, [pattern, flags, testStr]);

  const replacedResult = useMemo(() => {
    if (!pattern || !testStr) return "";
    try {
      return testStr.replace(new RegExp(pattern, flags), replaceStr);
    } catch {
      return "";
    }
  }, [pattern, flags, testStr, replaceStr]);

  const renderHighlighted = () => {
    const parts = result.highlighted.split(/<<<MARK>>>|<<<END>>>/);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <ToolLayout title="正则表达式测试器" description="在线测试正则表达式，高亮匹配结果">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">正则表达式</label>
            <input value={pattern} onChange={(e) => setPattern(e.target.value)}
              placeholder="输入正则表达式，如 \d+"
              className="w-full p-2.5 rounded-lg border font-mono text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1">标志</label>
            <input value={flags} onChange={(e) => setFlags(e.target.value)}
              placeholder="gim"
              className="w-full p-2.5 rounded-lg border font-mono text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
        </div>

        {result.error && (
          <div className="p-3 rounded-lg text-red-600 text-sm" style={{ background: "rgba(239,68,68,0.1)" }}>
            {result.error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">测试文本</label>
          <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)}
            placeholder="输入要测试的文本..."
            className="w-full h-32 p-3 rounded-lg border font-mono text-sm resize-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>

        {pattern && testStr && !result.error && (
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="text-sm font-medium mb-2">匹配结果 ({result.matches.length} 个)</p>
            <div className="font-mono text-sm whitespace-pre-wrap mb-3 leading-relaxed">
              {renderHighlighted()}
            </div>
            {result.matches.length > 0 && (
              <div className="space-y-1">
                {result.matches.map((m, i) => (
                  <div key={i} className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                    [{i}] 位置 {m.index}: &quot;{m.match}&quot;
                    {m.groups.length > 0 && ` (组: ${m.groups.join(", ")})`}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">替换为</label>
          <div className="flex gap-2">
            <input value={replaceStr} onChange={(e) => setReplaceStr(e.target.value)}
              placeholder="替换文本，可用 $1, $2 引用分组"
              className="flex-1 p-2.5 rounded-lg border font-mono text-sm"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }} />
          </div>
          {replacedResult && (
            <div className="mt-2 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap"
              style={{ background: "var(--muted)" }}>
              {replacedResult}
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--muted)" }}>
          <p className="font-medium mb-1">常用正则速查</p>
          <div className="grid grid-cols-2 gap-1 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
            <span>\d+ 数字</span>
            <span>\w+ 单词字符</span>
            <span>[a-z]+ 小写字母</span>
            <span>\s+ 空白字符</span>
            <span>^行首 $行尾</span>
            <span>.任意字符</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
