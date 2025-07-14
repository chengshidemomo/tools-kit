import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  RotateCcw, 
  Link, 
  FileText,
  ArrowUpDown,
  Globe
} from "lucide-react";

type EncodeType = 'component' | 'uri' | 'form';

const encodeTypes = {
  component: {
    name: 'Component',
    description: 'encodeURIComponent - 编码URL参数',
    encode: (str: string) => encodeURIComponent(str),
    decode: (str: string) => decodeURIComponent(str)
  },
  uri: {
    name: 'URI',
    description: 'encodeURI - 编码完整URL',
    encode: (str: string) => encodeURI(str),
    decode: (str: string) => decodeURI(str)
  },
  form: {
    name: 'Form',
    description: '表单编码 - application/x-www-form-urlencoded',
    encode: (str: string) => {
      return str.replace(/\s+/g, '+')
                .replace(/[^A-Za-z0-9+]/g, (char) => {
                  return '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
                });
    },
    decode: (str: string) => {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    }
  }
};

export default function UrlEncode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<EncodeType>('component');
  const { toast } = useToast();

  const processString = () => {
    try {
      const encoder = encodeTypes[encodeType];
      const result = operation === 'encode' 
        ? encoder.encode(input)
        : encoder.decode(input);
      
      setOutput(result);
      toast({
        title: "处理完成",
        description: `URL ${operation === 'encode' ? '编码' : '解码'}完成`,
      });
    } catch (error) {
      toast({
        title: "处理失败",
        description: operation === 'decode' ? '请输入有效的URL编码字符串' : '编码失败',
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
    component: {
      encode: "Hello World! 你好世界 #test=123&key=value",
      decode: "Hello%20World!%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%20%23test%3D123%26key%3Dvalue"
    },
    uri: {
      encode: "https://example.com/path?query=测试&id=123",
      decode: "https://example.com/path?query=%E6%B5%8B%E8%AF%95&id=123"
    },
    form: {
      encode: "name=张三&age=30&city=北京",
      decode: "name=%E5%BC%A0%E4%B8%89&age=30&city=%E5%8C%97%E4%BA%AC"
    }
  };

  const loadSample = () => {
    const sample = sampleData[encodeType];
    setInput(operation === 'encode' ? sample.encode : sample.decode);
    setOutput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">URL编解码工具</h1>
        <p className="text-muted-foreground">
          支持encodeURIComponent、encodeURI和表单编码等多种URL编码方式
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">编码类型:</label>
              <Select value={encodeType} onValueChange={(value: EncodeType) => setEncodeType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(encodeTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={operation === 'encode' ? 'default' : 'outline'}
                onClick={() => setOperation('encode')}
              >
                编码
              </Button>
              <Button 
                variant={operation === 'decode' ? 'default' : 'outline'}
                onClick={() => setOperation('decode')}
              >
                解码
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={processString} className="bg-gradient-primary hover:bg-primary-hover">
              <Link className="w-4 h-4 mr-2" />
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

          <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
            {encodeTypes[encodeType].description}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>
              {operation === 'encode' ? '原始URL/文本' : 'URL编码字符串'}
            </CardTitle>
            <CardDescription>
              {operation === 'encode' 
                ? '输入需要编码的URL或文本' 
                : '输入需要解码的URL编码字符串'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={operation === 'encode' 
                ? '输入URL或文本...' 
                : '输入URL编码字符串...'
              }
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {operation === 'encode' ? 'URL编码结果' : '解码结果'}
              {output && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {operation === 'encode' 
                ? '编码后的URL字符串' 
                : '解码后的原始内容'
              }
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

      {/* Info Section */}
      <Card className="border-0 bg-background shadow-soft">
        <CardHeader>
          <CardTitle>URL编码说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-primary" />
                <h4 className="font-medium">encodeURIComponent</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                最常用的编码方式，用于编码URL参数值。会编码除字母、数字、-、_、.、~之外的所有字符。
              </p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <div>输入: Hello World!</div>
                <div>输出: Hello%20World%21</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link className="w-5 h-5 text-primary" />
                <h4 className="font-medium">encodeURI</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                用于编码完整的URL。不会编码URL的保留字符（如:、/、?、#等），只编码非ASCII字符。
              </p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <div>输入: https://测试.com</div>
                <div>输出: https://%E6%B5%8B%E8%AF%95.com</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-medium">表单编码</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                用于HTML表单数据编码。空格转换为+号，其他特殊字符转换为%XX格式。
              </p>
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <div>输入: name=张 三</div>
                <div>输出: name=%E5%BC%A0+%E4%B8%89</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}