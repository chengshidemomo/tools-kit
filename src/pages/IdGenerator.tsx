import { useState } from "react";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Sparkles } from "lucide-react";

// Simple Snowflake (Twitter-style) generator
const EPOCH = 1577836800000n; // 2020-01-01
class Snowflake {
  private lastTs = -1n;
  private seq = 0n;
  constructor(private workerId = 1n, private datacenterId = 1n) {}
  next(): string {
    let ts = BigInt(Date.now());
    if (ts === this.lastTs) {
      this.seq = (this.seq + 1n) & 4095n;
      if (this.seq === 0n) {
        while (ts <= this.lastTs) ts = BigInt(Date.now());
      }
    } else {
      this.seq = 0n;
    }
    this.lastTs = ts;
    return (
      ((ts - EPOCH) << 22n) |
      (this.datacenterId << 17n) |
      (this.workerId << 12n) |
      this.seq
    ).toString();
  }
}

export default function IdGenerator() {
  const [count, setCount] = useState(10);
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<"v4" | "v7">("v4");

  const [snowflakes, setSnowflakes] = useState<string[]>([]);
  const [workerId, setWorkerId] = useState(1);
  const [datacenterId, setDatacenterId] = useState(1);

  const { toast } = useToast();

  const genUuids = () => {
    const fn = version === "v4" ? uuidv4 : uuidv7;
    setUuids(Array.from({ length: count }, () => fn()));
  };

  const genSnowflakes = () => {
    const sf = new Snowflake(BigInt(workerId), BigInt(datacenterId));
    setSnowflakes(Array.from({ length: count }, () => sf.next()));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">ID 生成器</h1>
        <p className="text-muted-foreground">批量生成 UUID 和雪花 ID</p>
      </div>

      <Tabs defaultValue="uuid" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="uuid">UUID</TabsTrigger>
          <TabsTrigger value="snowflake">雪花 ID</TabsTrigger>
        </TabsList>

        <TabsContent value="uuid" className="space-y-6 mt-0">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>版本</Label>
                <div className="flex gap-2">
                  {(["v4", "v7"] as const).map((v) => (
                    <Button key={v} size="sm" variant={version === v ? "default" : "outline"} onClick={() => setVersion(v)}>
                      UUID {v}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>数量</Label>
                <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="w-32" />
              </div>
              <Button onClick={genUuids} className="bg-gradient-primary hover:bg-primary-hover ml-auto">
                <Sparkles className="w-4 h-4 mr-2" />
                生成
              </Button>
            </CardContent>
          </Card>

          <ResultCard title="UUID" items={uuids} onCopy={copy} />
        </TabsContent>

        <TabsContent value="snowflake" className="space-y-6 mt-0">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6 flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Worker ID (0-31)</Label>
                <Input type="number" min={0} max={31} value={workerId} onChange={(e) => setWorkerId(+e.target.value)} className="w-32" />
              </div>
              <div className="space-y-2">
                <Label>数据中心 ID (0-31)</Label>
                <Input type="number" min={0} max={31} value={datacenterId} onChange={(e) => setDatacenterId(+e.target.value)} className="w-32" />
              </div>
              <div className="space-y-2">
                <Label>数量</Label>
                <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="w-32" />
              </div>
              <Button onClick={genSnowflakes} className="bg-gradient-primary hover:bg-primary-hover ml-auto">
                <Sparkles className="w-4 h-4 mr-2" />
                生成
              </Button>
            </CardContent>
          </Card>

          <ResultCard title="雪花 ID" items={snowflakes} onCopy={copy} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResultCard({ title, items, onCopy }: { title: string; items: string[]; onCopy: (s: string) => void }) {
  return (
    <Card className="bg-gradient-card border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title} ({items.length})
          {items.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => onCopy(items.join("\n"))}>
              <Copy className="w-4 h-4 mr-2" />
              全部复制
            </Button>
          )}
        </CardTitle>
        <CardDescription>点击「生成」按钮开始</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea value={items.join("\n")} readOnly className="min-h-80 font-mono text-sm bg-muted/30" />
      </CardContent>
    </Card>
  );
}
