import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Sparkles, FileText } from "lucide-react";

const sample = `1001
1002
1003

2001
2002`;

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const formatToInList = () => {
    const lines = input.split("\n");
    const cleaned: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed !== "") {
        cleaned.push("'" + trimmed + "'");
      }
    }
    const result = cleaned.join(",");
    setOutput(result);
    toast({ title: "格式化完成", description: `已处理 ${cleaned.length} 项` });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">SQL美化工具</h1>
        <p className="text-muted-foreground">
          将多行文本（每行一个值）清理并转换为 SQL IN 子句格式：'值1','值2','值3'
        </p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={formatToInList} className="bg-gradient-primary hover:bg-primary-hover">
              <Sparkles className="w-4 h-4 mr-2" />
              格式化
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
            <CardTitle>原始数据</CardTitle>
            <CardDescription>每行一个值，空行将被自动跳过</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"1001\n1002\n1003"}
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              格式化结果
              {output && (
                <Button size="sm" variant="outline" onClick={copy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>可直接用于 SQL IN (...) 子句</CardDescription>
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
