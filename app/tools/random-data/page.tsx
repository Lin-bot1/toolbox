"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

const lastNames = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹".split("");
const firstNames = ["伟","芳","娜","敏","静","丽","强","磊","军","洋","勇","艳","杰","娟","涛","明","超","秀英","华","建国","玉兰","志强","淑珍","文博","桂英","晓峰","婷婷","小红","子涵","欣怡"];
const cities = ["北京","上海","广州","深圳","杭州","成都","武汉","南京","重庆","西安","苏州","天津","长沙","郑州","青岛","大连","厦门","宁波","无锡","合肥"];
const streets = ["人民路","解放路","建设路","中山路","文化路","花园路","和平路","新华路","光明路","青年路"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genName() { return rand(lastNames) + rand(firstNames); }
function genPhone() { return "1" + [3,5,6,7,8,9][Math.floor(Math.random()*6)] + Array.from({length:9}, ()=>Math.floor(Math.random()*10)).join(""); }
function genIdCard() {
  const prov = ["11","12","13","14","15","21","22","23","31","32","33","34","35","36","37","41","42","43","44","45","46","50","51","52","53","54","61","62","63","64","65"];
  const year = randInt(1960, 2005);
  const month = String(randInt(1, 12)).padStart(2, "0");
  const day = String(randInt(1, 28)).padStart(2, "0");
  const seq = String(randInt(1, 999)).padStart(3, "0");
  return rand(prov) + "0101" + year + month + day + seq + Math.floor(Math.random() * 10);
}
function genEmail(name: string) {
  const domains = ["qq.com","163.com","gmail.com","outlook.com","foxmail.com"];
  return name.toLowerCase().replace(/[^a-z]/g, "") + randInt(10, 9999) + "@" + rand(domains);
}
function genAddress() { return rand(cities) + "市" + rand(streets) + randInt(1, 200) + "号"; }
function genIp() { return [randInt(1,255), randInt(0,255), randInt(0,255), randInt(1,255)].join("."); }

export default function RandomDataTool() {
  const [type, setType] = useState<"name" | "phone" | "idcard" | "email" | "address" | "ip" | "all">("all");
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState<string>("");

  const generate = useCallback(() => {
    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = genName();
      switch (type) {
        case "name": lines.push(name); break;
        case "phone": lines.push(genPhone()); break;
        case "idcard": lines.push(genIdCard()); break;
        case "email": lines.push(genEmail(name)); break;
        case "address": lines.push(genAddress()); break;
        case "ip": lines.push(genIp()); break;
        case "all":
          lines.push(`${name}\t${genPhone()}\t${genIdCard()}\t${genEmail(name)}\t${genAddress()}`);
          break;
      }
    }
    setOutput(lines.join("\n"));
  }, [type, count]);

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <ToolLayout title="随机数据生成" description="生成假姓名、手机号、身份证号等测试数据">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          {[
            { v: "all", l: "全部" },
            { v: "name", l: "姓名" },
            { v: "phone", l: "手机号" },
            { v: "idcard", l: "身份证" },
            { v: "email", l: "邮箱" },
            { v: "address", l: "地址" },
            { v: "ip", l: "IP地址" },
          ].map(({ v, l }) => (
            <button key={v} onClick={() => setType(v as typeof type)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{
                borderColor: type === v ? "var(--primary)" : "var(--border)",
                background: type === v ? "var(--primary)" : "var(--card)",
                color: type === v ? "white" : "var(--foreground)",
              }}>{l}</button>
          ))}
          <div className="flex items-center gap-1">
            <input type="number" min={1} max={1000} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 p-1.5 rounded-lg border text-sm text-center"
              style={{ background: "var(--card)", borderColor: "var(--border)" }} />
            <span className="text-sm">条</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={generate}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: "var(--primary)" }}>生成</button>
          {output && <button onClick={copy}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "var(--border)" }}>复制全部</button>}
        </div>

        {output && (
          <div>
            {type === "all" && (
              <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>格式: 姓名 手机号 身份证 邮箱 地址</p>
            )}
            <textarea value={output} readOnly
              className="w-full h-80 p-3 rounded-lg border font-mono text-sm resize-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
