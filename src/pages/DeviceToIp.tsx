import { copyText } from "@/lib/clipboard";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Network, FileText } from "lucide-react";

const sample = `010002013005006
192168000001080
127000000001443`;

export default function DeviceToIp() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const convert = () => {
    // (\d{3})(\d{3})(\d{3})(\d{3})(\d{3}) -> $1.$2.$3.$4 $5
    let result = input.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})/g, "$1.$2.$3.$4 $5");
    // (\b)0+(\d+) -> $2  去除前导零
    result = result.replace(/(\b)0+(\d+)/g, "$2");
    setOutput(result);
    toast({ title: "转换完成", description: "设备编号已转换为IP" });
  };

  const copy = () => {
    copyText(output);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">设备编号转IP</h1>
        <p className="text-muted-foreground">
          将15位设备编号按 3+3+3+3+3 切分为 IP+端口 格式，并自动去除前导零
        </p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={convert} variant="success">
              <Network className="w-4 h-4 mr-2" />
              转换
            </Button>
            <Button onClick={() => setInput(sample)} variant="ghost">
              <FileText className="w-4 h-4 mr-2" />
              示例
            </Button>
            <Button onClick={clear} variant="ghost">
              <RotateCcw className="w-4 h-4 mr-2" />
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>设备编号</CardTitle>
            <CardDescription>每行一个15位编号，例如 010002013005006</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"010002013005006"}
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              IP结果
              {output && (
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>格式：IP 端口（已去除前导零）</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="min-h-80 font-mono text-sm resize-none bg-muted/30"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
