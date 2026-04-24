import { useState } from "react";
import { format } from "sql-formatter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Sparkles, FileText } from "lucide-react";

const sample = `select u.id, u.name, count(o.id) as order_count from users u left join orders o on o.user_id=u.id where u.created_at>'2024-01-01' group by u.id, u.name having count(o.id)>5 order by order_count desc limit 10;`;

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<"sql" | "mysql" | "postgresql" | "sqlite">("sql");
  const { toast } = useToast();

  const beautify = () => {
    try {
      const result = format(input, { language: dialect, keywordCase: "upper", tabWidth: 2 });
      setOutput(result);
      toast({ title: "美化完成", description: "SQL已格式化" });
    } catch (e) {
      toast({ title: "美化失败", description: "请检查SQL语法", variant: "destructive" });
    }
  };

  const minify = () => {
    try {
      const result = format(input, { language: dialect }).replace(/\s+/g, " ").trim();
      setOutput(result);
      toast({ title: "压缩完成", description: "SQL已压缩为单行" });
    } catch (e) {
      toast({ title: "压缩失败", description: "请检查SQL语法", variant: "destructive" });
    }
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
        <p className="text-muted-foreground">格式化、美化和压缩SQL语句，支持多种数据库方言</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              {(["sql", "mysql", "postgresql", "sqlite"] as const).map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={dialect === d ? "default" : "outline"}
                  onClick={() => setDialect(d)}
                >
                  {d.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex gap-3 ml-auto">
              <Button onClick={beautify} className="bg-gradient-primary hover:bg-primary-hover">
                <Sparkles className="w-4 h-4 mr-2" />
                美化
              </Button>
              <Button onClick={minify} variant="outline">压缩</Button>
              <Button onClick={() => setInput(sample)} variant="ghost">
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
            <CardTitle>原始SQL</CardTitle>
            <CardDescription>输入需要美化的SQL语句</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="select * from users where ..."
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
            <CardDescription>美化后的SQL语句</CardDescription>
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
