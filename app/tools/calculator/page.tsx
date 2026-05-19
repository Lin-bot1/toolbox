"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function CalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);

  const input = useCallback((v: string) => {
    if (justEvaluated && /[0-9.]/.test(v)) { setDisplay(v); setExpr(v); setJustEvaluated(false); return; }
    if (justEvaluated && /[+\-*/]/.test(v)) { setExpr(display + v); setDisplay(display + v); setJustEvaluated(false); return; }
    setJustEvaluated(false);
    if (v === "." && display.includes(".")) return;
    if (display === "0" && v !== ".") { setDisplay(v); setExpr(expr + v); }
    else { setDisplay(display + v); setExpr(expr + v); }
  }, [display, expr, justEvaluated]);

  const op = useCallback((v: string) => { setJustEvaluated(false); setExpr(expr + " " + v + " "); setDisplay("0"); }, [expr]);
  const clear = useCallback(() => { setDisplay("0"); setExpr(""); setJustEvaluated(false); }, []);
  const backspace = useCallback(() => { display.length > 1 ? setDisplay(display.slice(0, -1)) : setDisplay("0"); }, [display]);

  const evaluate = useCallback(() => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, "");
      const result = Function(`"use strict"; return (${sanitized})`)();
      setDisplay(Number.isFinite(result) ? parseFloat(result.toFixed(10)).toString() : "Error");
      setExpr(sanitized); setJustEvaluated(true);
    } catch { setDisplay("Error"); setJustEvaluated(true); }
  }, [expr]);

  const buttons = [
    ["C", "⌫", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  const btnStyle = (v: string): React.CSSProperties => {
    if (v === "=") return { background: "var(--primary)", color: "white", boxShadow: "0 4px 12px var(--primary-glow)" };
    if (["+", "-", "*", "/", "%"].includes(v)) return { background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 700 };
    if (["C", "⌫"].includes(v)) return { background: "var(--bg-muted)", color: "var(--fg-muted)" };
    return { background: "var(--bg-card)" };
  };

  const handleBtn = (v: string) => {
    if (v === "C") clear(); else if (v === "⌫") backspace(); else if (v === "=") evaluate();
    else if (v === "±") { display.startsWith("-") ? setDisplay(display.slice(1)) : setDisplay("-" + display); }
    else if (["+", "-", "*", "/", "%"].includes(v)) op(v); else input(v);
  };

  return (
    <ToolLayout title="简易计算器" description="在线科学计算器">
      <div className="max-w-xs mx-auto space-y-3 animate-fade-in">
        {/* Display */}
        <div className="p-5 rounded-[var(--radius)] border relative overflow-hidden"
          style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }}>
          <p className="text-right text-xs h-5 font-mono truncate" style={{ color: "var(--fg-muted)" }}>
            {expr || " "}
          </p>
          <p className="text-right text-4xl font-mono font-bold truncate mt-1">{display}</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((v, i) => (
            <button key={i} onClick={() => handleBtn(v)}
              className="p-4 rounded-[var(--radius)] text-lg font-semibold border transition-all duration-100 active:scale-95"
              style={{ borderColor: "var(--border)", ...btnStyle(v) }}>
              {v}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
