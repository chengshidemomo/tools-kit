import { copyText } from "@/lib/clipboard";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, FileText, AlertCircle } from "lucide-react";

const sample = `1.1.1.1
8.8.8.8
114.114.114.114
192.168.1.0/24
2408:8719:0010:0000:0000:0000:0000:0001`;

function splitTokens(input: string): string[] {
  return input
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token !== "");
}

function isIpOrCidr(token: string): boolean {
  const [addr, prefix] = token.split("/");
  if (prefix !== undefined && !/^\d{1,3}$/.test(prefix)) return false;

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(addr)) {
    const octets = addr.split(".").map(Number);
    if (!octets.every((n) => n >= 0 && n <= 255)) return false;
    return prefix === undefined || Number(prefix) <= 32;
  }

  if (addr.includes(":") && /^[0-9a-fA-F:]+$/.test(addr)) {
    return prefix === undefined || Number(prefix) <= 128;
  }

  return false;
}

function toNginxRules(tokens: string[]): string {
  return tokens
    .map((token) => {
      if (token.includes("/")) return `allow ${token};`;
      const mask = token.includes(":") ? "/128" : "/32";
      return `allow ${token}${mask};`;
    })
    .join("\n");
}

function toJsonItems(tokens: string[]): string {
  return tokens
    .map((token, index) => (index === tokens.length - 1 ? `"${token}"` : `"${token}",`))
    .join("\n");
}

type OutputFormat = "nginx" | "json";

export default function IpWhitelist() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("nginx");
  const [invalidCount, setInvalidCount] = useState(0);
  const { toast } = useToast();

  const build = (fmt: OutputFormat, value: string) => {
    const tokens = splitTokens(value);
    const bad = tokens.filter((token) => !isIpOrCidr(token)).length;
    return {
      text: fmt === "nginx" ? toNginxRules(tokens) : toJsonItems(tokens),
      count: tokens.length,
      bad,
    };
  };

  const convert = () => {
    const { text, count, bad } = build(format, input);
    setOutput(text);
    setInvalidCount(bad);

    if (count === 0) {
      toast({ title: "没有内容", description: "请先输入IP地址", variant: "destructive" });
      return;
    }
    if (bad > 0) {
      toast({
        title: "转换完成",
        description: `已处理 ${count} 项，其中 ${bad} 项不是合法IP，请检查`,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "转换完成", description: `已处理 ${count} 项IP` });
  };

  const switchFormat = (fmt: OutputFormat) => {
    setFormat(fmt);
    if (output !== "") {
      const result = build(fmt, input);
      setOutput(result.text);
      setInvalidCount(result.bad);
    }
  };

  const copy = () => {
    copyText(output);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setInvalidCount(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">IP白名单转换</h1>
        <p className="text-muted-foreground">
          批量把IP地址转换成 Nginx allow 白名单规则，或 JSON 数组元素格式
        </p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-muted-foreground">输出格式</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={format === "nginx" ? "default" : "outline"}
                  onClick={() => switchFormat("nginx")}
                >
                  Nginx白名单
                </Button>
                <Button
                  size="sm"
                  variant={format === "json" ? "default" : "outline"}
                  onClick={() => switchFormat("json")}
                >
                  JSON元素
                </Button>
              </div>
            </div>
            <Button onClick={convert} variant="success">
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
            <CardTitle>IP地址</CardTitle>
            <CardDescription>支持多行，也可用空格、逗号分隔；空行自动跳过</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"1.1.1.1\n8.8.8.8"}
              className="min-h-80 font-mono text-sm resize-none"
            />
            {invalidCount > 0 && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{invalidCount} 项不是合法IP</span>
                </div>
                <p className="text-sm text-destructive mt-1">
                  这些内容已原样输出，请确认是否填写正确
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              转换结果
              {output && (
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {format === "nginx"
                ? "每行一条 allow 规则，可直接粘贴进 nginx 配置"
                : "每行一个 JSON 字符串元素，最后一行不带逗号"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder={format === "nginx" ? "allow 1.1.1.1/32;" : '"1.1.1.1",'}
              className="min-h-80 font-mono text-sm resize-none bg-muted/30"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-background shadow-soft">
        <CardHeader>
          <CardTitle>格式说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-medium mb-2">Nginx白名单</h4>
              <p className="text-sm text-muted-foreground mb-2">
                单个IP自动补 /32，IPv6 自动补 /128；已带网段的按原样输出
              </p>
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
{`allow 1.1.1.1/32;
allow 192.168.1.0/24;`}
              </pre>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-medium mb-2">JSON数组元素</h4>
              <p className="text-sm text-muted-foreground mb-2">
                每行一个带引号的元素，最后一行不加逗号，可直接放进数组
              </p>
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
{`"1.1.1.1",
"8.8.8.8"`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
