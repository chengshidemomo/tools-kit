import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2,
  RotateCcw,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

function tryParseJson(value: string): any | null {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  return null;
}

function deepParseNested(value: any, maxDepth = 10, currentDepth = 0): any {
  if (currentDepth >= maxDepth) return value;

  if (typeof value === "string") {
    const parsed = tryParseJson(value);
    if (parsed !== null) {
      return deepParseNested(parsed, maxDepth, currentDepth + 1);
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepParseNested(item, maxDepth, currentDepth + 1));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      result[key] = deepParseNested(value[key], maxDepth, currentDepth + 1);
    }
    return result;
  }

  return value;
}

function parseNestedJson(input: string, maxDepth = 10): any {
  const parsed = JSON.parse(input);
  return deepParseNested(parsed, maxDepth, 0);
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [autoUnescape, setAutoUnescape] = useState(true);
  const { toast } = useToast();

  const parseInput = (): any => {
    if (autoUnescape) {
      return parseNestedJson(input);
    }
    return JSON.parse(input);
  };

  const formatJson = () => {
    try {
      const parsed = parseInput();
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      toast({
        title: "格式化成功",
        description: "JSON数据已成功格式化",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON格式错误");
      setIsValid(false);
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = parseInput();
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      toast({
        title: "压缩成功",
        description: "JSON数据已成功压缩",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON格式错误");
      setIsValid(false);
      setOutput("");
    }
  };

  const validateJson = () => {
    try {
      parseInput();
      setIsValid(true);
      setError("");
      toast({
        title: "验证成功",
        description: "JSON格式正确",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON格式错误");
      setIsValid(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    });
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  const sampleJson = `{
  "name": "张三",
  "age": 30,
  "city": "北京",
  "skills": ["JavaScript", "React", "Node.js"],
  "isActive": true,
  "address": {
    "street": "朝阳区",
    "zipCode": "100000"
  }
}`;

  const nestedSample = '{"data": "{\\"user\\":{\\"id\\":1,\\"name\\":\\"张三\\"}}"}';

  const loadSample = () => {
    setInput(sampleJson);
    setIsValid(null);
    setError("");
    setOutput("");
  };

  const loadNestedSample = () => {
    setInput(nestedSample);
    setIsValid(null);
    setError("");
    setOutput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">JSON格式化工具</h1>
        <p className="text-muted-foreground">
          验证、格式化和压缩JSON数据，支持语法高亮和错误检测
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={formatJson} className="bg-gradient-primary hover:bg-primary-hover">
          <Maximize2 className="w-4 h-4 mr-2" />
          格式化
        </Button>
        <Button onClick={minifyJson} variant="outline">
          <Minimize2 className="w-4 h-4 mr-2" />
          压缩
        </Button>
        <Button onClick={validateJson} variant="outline">
          <CheckCircle className="w-4 h-4 mr-2" />
          验证
        </Button>
        <Button onClick={loadSample} variant="ghost">
          <FileText className="w-4 h-4 mr-2" />
          示例数据
        </Button>
        <Button onClick={loadNestedSample} variant="ghost">
          <Layers className="w-4 h-4 mr-2" />
          嵌套示例
        </Button>
        <Button onClick={clearAll} variant="ghost">
          <RotateCcw className="w-4 h-4 mr-2" />
          清空
        </Button>
        <div className="flex items-center space-x-2 ml-auto">
          <Switch
            id="nested-mode"
            checked={autoUnescape}
            onCheckedChange={setAutoUnescape}
          />
          <Label htmlFor="nested-mode" className="cursor-pointer">嵌套解析</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              输入JSON
              {isValid === true && <Badge className="bg-green-100 text-green-800">有效</Badge>}
              {isValid === false && <Badge variant="destructive">无效</Badge>}
            </CardTitle>
            <CardDescription>
              在此处粘贴或输入您的JSON数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴您的JSON数据..."
              className={cn(
                "min-h-96 font-mono text-sm resize-none",
                isValid === false && "border-destructive focus:border-destructive"
              )}
            />
            {error && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">JSON错误</span>
                </div>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              格式化结果
              {output && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadFile}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              格式化后的JSON数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder="格式化结果将显示在这里..."
              className="min-h-96 font-mono text-sm resize-none bg-muted/30"
            />
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card className="border-0 bg-background shadow-soft">
        <CardHeader>
          <CardTitle>功能特点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">语法验证</h4>
                <p className="text-sm text-muted-foreground">实时检测JSON语法错误</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">智能格式化</h4>
                <p className="text-sm text-muted-foreground">美化JSON，提高可读性</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Minimize2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">数据压缩</h4>
                <p className="text-sm text-muted-foreground">移除空格，减小文件大小</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">嵌套解析</h4>
                <p className="text-sm text-muted-foreground">自动解开多层JSON字符串</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}