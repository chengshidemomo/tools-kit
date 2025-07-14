import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  RotateCcw, 
  Code, 
  FileText,
  ArrowUpDown,
  Zap
} from "lucide-react";

type EscapeMode = 'html' | 'javascript' | 'json' | 'xml' | 'csv' | 'sql' | 'url';

const escapeModes = {
  html: {
    name: 'HTML',
    description: 'HTML实体编码',
    encode: (str: string) => 
      str.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#x27;')
         .replace(/\//g, '&#x2F;'),
    decode: (str: string) =>
      str.replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&#x27;/g, "'")
         .replace(/&#x2F;/g, '/')
  },
  javascript: {
    name: 'JavaScript',
    description: 'JavaScript字符串转义',
    encode: (str: string) => 
      str.replace(/\\/g, '\\\\')
         .replace(/"/g, '\\"')
         .replace(/'/g, "\\'")
         .replace(/\n/g, '\\n')
         .replace(/\r/g, '\\r')
         .replace(/\t/g, '\\t'),
    decode: (str: string) =>
      str.replace(/\\n/g, '\n')
         .replace(/\\r/g, '\r')
         .replace(/\\t/g, '\t')
         .replace(/\\"/g, '"')
         .replace(/\\'/g, "'")
         .replace(/\\\\/g, '\\')
  },
  json: {
    name: 'JSON',
    description: 'JSON字符串转义',
    encode: (str: string) => JSON.stringify(str).slice(1, -1),
    decode: (str: string) => {
      try {
        return JSON.parse(`"${str}"`);
      } catch {
        return str;
      }
    }
  },
  xml: {
    name: 'XML',
    description: 'XML实体编码',
    encode: (str: string) =>
      str.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&apos;'),
    decode: (str: string) =>
      str.replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&apos;/g, "'")
  },
  csv: {
    name: 'CSV',
    description: 'CSV字段转义',
    encode: (str: string) => {
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    },
    decode: (str: string) => {
      if (str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1).replace(/""/g, '"');
      }
      return str;
    }
  },
  sql: {
    name: 'SQL',
    description: 'SQL字符串转义',
    encode: (str: string) =>
      str.replace(/'/g, "''")
         .replace(/\\/g, '\\\\'),
    decode: (str: string) =>
      str.replace(/''/g, "'")
         .replace(/\\\\/g, '\\')
  },
  url: {
    name: 'URL',
    description: 'URL编码',
    encode: (str: string) => encodeURIComponent(str),
    decode: (str: string) => {
      try {
        return decodeURIComponent(str);
      } catch {
        return str;
      }
    }
  }
};

export default function StringEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<EscapeMode>('html');
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const processString = () => {
    try {
      const escapeMode = escapeModes[mode];
      const result = operation === 'encode' 
        ? escapeMode.encode(input)
        : escapeMode.decode(input);
      
      setOutput(result);
      toast({
        title: "处理完成",
        description: `${escapeMode.name} ${operation === 'encode' ? '编码' : '解码'}完成`,
      });
    } catch (error) {
      toast({
        title: "处理失败",
        description: "请检查输入内容是否正确",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    });
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setOperation(operation === 'encode' ? 'decode' : 'encode');
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const sampleData = {
    html: '<div class="container">Hello & welcome to our "website"!</div>',
    javascript: 'alert("Hello\\nWorld!");',
    json: 'Hello "World" with\nnewlines',
    xml: '<message>Hello & welcome to our "XML" document!</message>',
    csv: 'John, Doe, "Software Engineer, Senior"',
    sql: "SELECT * FROM users WHERE name = 'O'Connor'",
    url: 'Hello World! 你好世界'
  };

  const loadSample = () => {
    setInput(sampleData[mode]);
    setOutput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">字符串转义工具</h1>
        <p className="text-muted-foreground">
          支持HTML、JavaScript、JSON、XML等多种格式的字符串编码转换
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">格式类型:</label>
              <Select value={mode} onValueChange={(value: EscapeMode) => setMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(escapeModes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">操作:</label>
              <Select value={operation} onValueChange={(value: 'encode' | 'decode') => setOperation(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encode">编码</SelectItem>
                  <SelectItem value="decode">解码</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="text-xs">
              {escapeModes[mode].description}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={processString} className="bg-gradient-primary hover:bg-primary-hover">
              <Zap className="w-4 h-4 mr-2" />
              {operation === 'encode' ? '编码' : '解码'}
            </Button>
            <Button onClick={swapInputOutput} variant="outline">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              交换
            </Button>
            <Button onClick={loadSample} variant="ghost">
              <FileText className="w-4 h-4 mr-2" />
              示例数据
            </Button>
            <Button onClick={clearAll} variant="ghost">
              <RotateCcw className="w-4 h-4 mr-2" />
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
            <CardDescription>
              输入需要{operation === 'encode' ? '编码' : '解码'}的文本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入需要${operation === 'encode' ? '编码' : '解码'}的文本...`}
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {operation === 'encode' ? '编码' : '解码'}结果
              {output && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {operation === 'encode' ? '编码' : '解码'}后的文本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder={`${operation === 'encode' ? '编码' : '解码'}结果将显示在这里...`}
              className="min-h-80 font-mono text-sm resize-none bg-muted/30"
            />
          </CardContent>
        </Card>
      </div>

      {/* Format Info */}
      <Card className="border-0 bg-background shadow-soft">
        <CardHeader>
          <CardTitle>格式说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(escapeModes).map(([key, value]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  mode === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setMode(key as EscapeMode)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">{value.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}