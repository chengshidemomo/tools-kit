import { useMemo, useState } from "react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const presets = [
  { label: "每分钟", value: "* * * * *" },
  { label: "每小时", value: "0 * * * *" },
  { label: "每天0点", value: "0 0 * * *" },
  { label: "每周一9点", value: "0 9 * * 1" },
  { label: "每月1日", value: "0 0 1 * *" },
  { label: "每5分钟", value: "*/5 * * * *" },
];

const pad = (n: number) => n.toString().padStart(2, "0");
const fmt = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export default function CronExpression() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const description = useMemo(() => {
    try {
      return cronstrue.toString(expr, { locale: "zh_CN" });
    } catch (e: any) {
      return null;
    }
  }, [expr]);

  const nextRuns = useMemo(() => {
    try {
      const it = CronExpressionParser.parse(expr);
      return Array.from({ length: 8 }, () => fmt(it.next().toDate()));
    } catch {
      return [];
    }
  }, [expr]);

  const valid = description !== null && nextRuns.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Cron 表达式</h1>
        <p className="text-muted-foreground">解析 Cron 表达式并预测下次执行时间</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>表达式</CardTitle>
          <CardDescription>格式：分 时 日 月 周</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0 9 * * 1-5"
            className="font-mono text-lg"
          />
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button key={p.value} size="sm" variant="outline" onClick={() => setExpr(p.value)}>
                {p.label}
                <code className="ml-2 text-xs text-muted-foreground">{p.value}</code>
              </Button>
            ))}
          </div>
          <div>
            {valid ? (
              <Badge className="text-sm py-1 px-3">{description}</Badge>
            ) : (
              <Badge variant="destructive">表达式无效</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>未来 8 次执行时间</CardTitle>
        </CardHeader>
        <CardContent>
          {nextRuns.length > 0 ? (
            <ol className="space-y-1 font-mono text-sm">
              {nextRuns.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-muted-foreground w-6">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground">无法解析</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
