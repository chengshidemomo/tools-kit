import { copyText } from "@/lib/clipboard";
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
  const [quoteStyle, setQuoteStyle] = useState<"single" | "double">("single");

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

  const buildInList = (style: "single" | "double", input: string) => {
    const quote = style === "single" ? "'" : '"';
    const values = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map((line) => quote + line + quote);
    return { text: values.join(","), count: values.length };
  };

  const convertToInList = () => {
    const { text, count } = buildInList(quoteStyle, inListInput);
    setInListOutput(text);
    toast({
      title: "转换完成",
      description: `已处理 ${count} 项，使用${quoteStyle === "single" ? "单" : "双"}引号`,
    });
  };

  const switchQuoteStyle = (style: "single" | "double") => {
    setQuoteStyle(style);
    if (inListOutput !== "") {
      setInListOutput(buildInList(style, inListInput).text);
    }
  };

  const copy = (text: string) => {
    copyText(text);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">SQL美化工具</h1>
        <p className="text-muted-foreground">格式化SQL语句，并提供常用的SQL辅助子工具</p>
      </div>

      <Tabs defaultValue="inlist" className="space-y-6">
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
                  <Button onClick={beautify} variant="success">
                    <Sparkles className="w-4 h-4 mr-2" />
                    美化
                  </Button>
                  <Button onClick={minify} variant="success">
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-sm text-muted-foreground">引号</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={quoteStyle === "single" ? "default" : "outline"}
                      onClick={() => switchQuoteStyle("single")}
                    >
                      单引号 '
                    </Button>
                    <Button
                      size="sm"
                      variant={quoteStyle === "double" ? "default" : "outline"}
                      onClick={() => switchQuoteStyle("double")}
                    >
                      双引号 "
                    </Button>
                  </div>
                </div>
                <Button onClick={convertToInList} variant="success">
                  转换
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
