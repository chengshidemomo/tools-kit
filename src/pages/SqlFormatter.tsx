import { useState } from "react";
import { format } from "sql-formatter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Sparkles, FileText, List } from "lucide-react";

const beautifySample = `select u.id, u.name, count(o.id) as order_count from users u left join orders o on o.user_id=u.id where u.created_at>'2024-01-01' group by u.id, u.name having count(o.id)>5 order by order_count desc limit 10;`;

const inListSample = `1001
1002
1003

2001
2002`;

export default function SqlFormatter() {
  // 美化功能状态
  const [beautifyInput, setBeautifyInput] = useState("");
  const [beautifyOutput, setBeautifyOutput] = useState("");
  const [dialect, setDialect] = useState<"sql" | "mysql" | "postgresql" | "sqlite">("sql");

  // IN列表功能状态
  const [inListInput, setInListInput] = useState("");
  const [inListOutput, setInListOutput] = useState("");

  const { toast } = useToast();

  const beautify = () => {
    try {
      const result = format(beautifyInput, {
        language: dialect,
        keywordCase: "upper",
        tabWidth: 2,
      });
      setBeautifyOutput(result);
      toast({ title: "美化完成", description: "SQL已格式化" });
    } catch (e) {
      toast({ title: "美化失败", description: "请检查SQL语法", variant: "destructive" });
    }
  };

  const minify = () => {
    try {
      const result = format(beautifyInput, { language: dialect })
        .replace(/\s+/g, " ")
        .trim();
      setBeautifyOutput(result);
      toast({ title: "压缩完成", description: "SQL已压缩为单行" });
    } catch (e) {
      toast({ title: "压缩失败", description: "请检查SQL语法", variant: "destructive" });
    }
  };

  const convertToInList = () => {
    const lines = inListInput.split("\n");
    const cleaned: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed !== "") {
        cleaned.push("'" + trimmed + "'");
      }
    }
    const result = cleaned.join(",");
    setInListOutput(result);
    toast({ title: "转换完成", description: `已处理 ${cleaned.length} 项` });
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">SQL美化工具</h1>
        <p className="text-muted-foreground">格式化SQL语句，并提供常用的SQL辅助子工具</p>
      </div>

      <Tabs defaultValue="beautify" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="beautify">
            <Sparkles className="w-4 h-4 mr-2" />
            SQL美化
          </TabsTrigger>
          <TabsTrigger value="inlist">
            <List className="w-4 h-4 mr-2" />
            转IN列表
          </TabsTrigger>
        </TabsList>

        {/* 美化子功能 */}
        <TabsContent value="beautify" className="space-y-6 mt-0">
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
                  <Button onClick={minify} variant="outline">
                    压缩
                  </Button>
                  <Button onClick={() => setBeautifyInput(beautifySample)} variant="ghost">
                    <FileText className="w-4 h-4 mr-2" />
                    示例
                  </Button>
                  <Button
                    onClick={() => {
                      setBeautifyInput("");
                      setBeautifyOutput("");
                    }}
                    variant="ghost"
                  >
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
                  value={beautifyInput}
                  onChange={(e) => setBeautifyInput(e.target.value)}
                  placeholder="select * from users where ..."
                  className="min-h-80 font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  格式化结果
                  {beautifyOutput && (
                    <Button size="sm" variant="outline" onClick={() => copy(beautifyOutput)}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>美化后的SQL语句</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={beautifyOutput}
                  readOnly
                  placeholder="结果将显示在这里..."
                  className="min-h-80 font-mono text-sm resize-none bg-muted/30"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IN列表子功能 */}
        <TabsContent value="inlist" className="space-y-6 mt-0">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={convertToInList} className="bg-gradient-primary hover:bg-primary-hover">
                  <List className="w-4 h-4 mr-2" />
                  转换为IN列表
                </Button>
                <Button onClick={() => setInListInput(inListSample)} variant="ghost">
                  <FileText className="w-4 h-4 mr-2" />
                  示例
                </Button>
                <Button
                  onClick={() => {
                    setInListInput("");
                    setInListOutput("");
                  }}
                  variant="ghost"
                >
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
                  value={inListInput}
                  onChange={(e) => setInListInput(e.target.value)}
                  placeholder={"1001\n1002\n1003"}
                  className="min-h-80 font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  IN列表结果
                  {inListOutput && (
                    <Button size="sm" variant="outline" onClick={() => copy(inListOutput)}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>可直接用于 SQL IN (...) 子句</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inListOutput}
                  readOnly
                  placeholder="结果将显示在这里..."
                  className="min-h-80 font-mono text-sm resize-none bg-muted/30"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
