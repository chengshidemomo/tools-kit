import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Network, FileText, ArrowRightLeft } from "lucide-react";

const deviceSample = `010002013005006
192168000001080
127000000001443`;

const ipSample = `10.0.2.13 5006
192.168.0.1 80
127.0.0.1 443`;

export default function DeviceToIp() {
  const [mode, setMode] = useState<"device-to-ip" | "ip-to-device">("device-to-ip");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const deviceToIp = (text: string) => {
    return text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!/^\d{15}$/.test(trimmed)) return trimmed;
        let result = trimmed.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})/g, "$1.$2.$3.$4 $5");
        result = result.replace(/(\b)0+(\d+)/g, "$2");
        return result;
      })
      .join("\n");
  };

  const ipToDevice = (text: string) => {
    return text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        // Try "IP:port" first, then "IP port"
        let parts = trimmed.split("");
        let port = "";
        let ip = "";

        if (trimmed.includes(":")) {
          const [ipPart, portPart] = trimmed.split(":");
          ip = ipPart?.trim() || "";
          port = portPart?.trim() || "";
        } else {
          const spaceIdx = trimmed.lastIndexOf(" ");
          if (spaceIdx > 0) {
            ip = trimmed.slice(0, spaceIdx).trim();
            port = trimmed.slice(spaceIdx + 1).trim();
          } else {
            ip = trimmed;
          }
        }

        const ipSegments = ip.split(".");
        if (ipSegments.length !== 4) {
          return `错误: ${trimmed}`;
        }

        const normalized = ipSegments.map((seg) => {
          const num = parseInt(seg, 10);
          if (isNaN(num) || num < 0 || num > 255) return "ERR";
          return num.toString().padStart(3, "0");
        });

        if (normalized.includes("ERR")) {
          return `错误: ${trimmed}`;
        }

        const portNum = parseInt(port || "0", 10);
        if (isNaN(portNum) || portNum < 0 || portNum > 999) {
          return `错误: ${trimmed}`;
        }
        const normalizedPort = portNum.toString().padStart(3, "0");

        return normalized.join("") + normalizedPort;
      })
      .join("\n");
  };

  const convert = () => {
    const result = mode === "device-to-ip" ? deviceToIp(input) : ipToDevice(input);
    setOutput(result);
    toast({
      title: "转换完成",
      description: mode === "device-to-ip" ? "设备编号已转换为IP" : "IP已转换为设备编号",
    });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const isDeviceToIp = mode === "device-to-ip";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">设备编号 ↔ IP 互转</h1>
        <p className="text-muted-foreground">
          支持设备编号与 IP+端口 之间的双向转换
        </p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="device-to-ip" className="gap-2">
                  <Network className="w-4 h-4" />
                  编号转IP
                </TabsTrigger>
                <TabsTrigger value="ip-to-device" className="gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  IP转编号
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap gap-3">
              <Button onClick={convert} className="bg-gradient-primary hover:bg-primary-hover">
                <Network className="w-4 h-4 mr-2" />
                转换
              </Button>
              <Button onClick={() => setInput(isDeviceToIp ? deviceSample : ipSample)} variant="ghost">
                <FileText className="w-4 h-4 mr-2" />
                示例
              </Button>
              <Button onClick={clear} variant="ghost">
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>{isDeviceToIp ? "设备编号" : "IP + 端口"}</CardTitle>
            <CardDescription>
              {isDeviceToIp
                ? "每行一个15位编号，例如 010002013005006"
                : "每行一个 IP 和端口，例如 10.0.2.13:5006 或 10.0.2.13 5006"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isDeviceToIp ? "010002013005006" : "10.0.2.13 5006"}
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isDeviceToIp ? "IP结果" : "设备编号结果"}
              {output && (
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {isDeviceToIp ? "格式：IP 端口（已去除前导零）" : "格式：15位设备编号"}
            </CardDescription>
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

