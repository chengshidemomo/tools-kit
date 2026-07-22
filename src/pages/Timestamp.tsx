import { copyText } from "@/lib/clipboard";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Clock } from "lucide-react";

const pad = (n: number) => n.toString().padStart(2, "0");
const fmt = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtUtc = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

export default function Timestamp() {
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState(fmt(new Date()));
  const { toast } = useToast();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const tsNum = Number(tsInput);
  const tsDate = !isNaN(tsNum) && tsInput
    ? new Date(tsInput.length > 10 ? tsNum : tsNum * 1000)
    : null;

  const parsedDate = (() => {
    const d = new Date(dateInput.replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  })();

  const copy = (text: string) => {
    copyText(text);
    toast({ title: "已复制" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">时间戳转换</h1>
        <p className="text-muted-foreground">Unix 时间戳与日期格式互转</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            当前时间
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground">秒</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-muted px-2 py-1 rounded">{Math.floor(now / 1000)}</code>
              <Button size="sm" variant="ghost" onClick={() => copy(String(Math.floor(now / 1000)))}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">毫秒</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-muted px-2 py-1 rounded">{now}</code>
              <Button size="sm" variant="ghost" onClick={() => copy(String(now))}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">本地</Label>
            <div className="mt-1"><code className="bg-muted px-2 py-1 rounded">{fmt(new Date(now))}</code></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>时间戳 → 日期</CardTitle>
            <CardDescription>支持秒(10位)或毫秒(13位)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={tsInput} onChange={(e) => setTsInput(e.target.value)} placeholder="1700000000" className="font-mono" />
            {tsDate && (
              <div className="space-y-2 text-sm">
                <Row label="本地时间" value={fmt(tsDate)} onCopy={copy} />
                <Row label="UTC时间" value={fmtUtc(tsDate) + " UTC"} onCopy={copy} />
                <Row label="ISO 8601" value={tsDate.toISOString()} onCopy={copy} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>日期 → 时间戳</CardTitle>
            <CardDescription>格式：YYYY-MM-DD HH:mm:ss</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={dateInput} onChange={(e) => setDateInput(e.target.value)} placeholder="2024-01-01 00:00:00" className="font-mono" />
            {parsedDate && (
              <div className="space-y-2 text-sm">
                <Row label="秒" value={String(Math.floor(parsedDate.getTime() / 1000))} onCopy={copy} />
                <Row label="毫秒" value={String(parsedDate.getTime())} onCopy={copy} />
                <Row label="ISO" value={parsedDate.toISOString()} onCopy={copy} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, onCopy }: { label: string; value: string; onCopy: (s: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <code className="bg-muted px-2 py-1 rounded flex-1 truncate">{value}</code>
      <Button size="sm" variant="ghost" onClick={() => onCopy(value)}>
        <Copy className="w-3 h-3" />
      </Button>
    </div>
  );
}
