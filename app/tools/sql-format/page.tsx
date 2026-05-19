"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "CROSS",
  "ON", "GROUP", "BY", "ORDER", "HAVING", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "NOT", "NULL", "DEFAULT", "PRIMARY", "KEY", "FOREIGN",
  "REFERENCES", "UNIQUE", "CHECK", "CONSTRAINT", "CASCADE", "DISTINCT", "AS", "IN", "BETWEEN", "LIKE",
  "IS", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "UNION", "ALL", "LIMIT", "OFFSET",
  "ASC", "DESC", "COUNT", "SUM", "AVG", "MAX", "MIN", "HAVING", "WITH", "RECURSIVE", "OVER",
  "PARTITION", "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "COALESCE", "CAST", "CONVERT"];

function formatSql(sql: string): string {
  let result = sql.replace(/\s+/g, " ").trim();

  const kwPattern = new RegExp(`\b(${keywords.join("|")})\b`, "gi");
  result = result.replace(kwPattern, (m) => m.toUpperCase());

  const majorKeywords = ["SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LEFT JOIN",
    "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "CROSS JOIN", "UNION ALL", "UNION", "VALUES",
    "INSERT INTO", "UPDATE", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
    "SET", "WITH"];

  for (const kw of majorKeywords.sort((a, b) => b.length - a.length)) {
    result = result.replace(new RegExp(`\s*${kw.replace(/ /g, "\s+")}\s*`, "gi"), `\n${kw} `);
  }

  result = result.replace(/,\s*/g, ",\n  ");
  result = result.replace(/\(\s*/g, "(\n  ");
  result = result.replace(/\s*\)/g, "\n)");

  return result.trim();
}

function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").replace(/\s*([,()])\s*/g, "$1").trim();
}

const sample = `select u.id, u.name, u.email, o.order_date, o.total_amount from users u left join orders o on u.id = o.user_id where u.created_at >= '2024-01-01' and (o.status = 'completed' or o.status is null) group by u.id, u.name having count(o.id) > 0 order by o.order_date desc limit 100`;

export default function SqlFormatTool() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");

  return (
    <ToolLayout title="SQL 格式化" description="美化/压缩 SQL 语句">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setOutput(formatSql(input))}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>格式化</button>
          <button onClick={() => setOutput(minifySql(input))}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>压缩</button>
          {output && <button onClick={() => navigator.clipboard.writeText(output)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}>复制</button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">输入 SQL</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">输出结果</label>
            <textarea value={output} readOnly placeholder="结果将显示在这里"
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
