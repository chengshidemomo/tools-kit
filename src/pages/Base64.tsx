import { copyText } from "@/lib/clipboard";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  RotateCcw, 
  Code, 
  FileText,
  ArrowUpDown,
  Upload,
  Download
} from "lucide-react";

export default function Base64() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const processString = () => {
    try {
      const result = operation === 'encode' 
        ? btoa(unescape(encodeURIComponent(input)))
        : decodeURIComponent(escape(atob(input)));
      
      setOutput(result);
      toast({
        title: "处理完成",
        description: `Base64 ${operation === 'encode' ? '编码' : '解码'}完成`,
      });
    } catch (error) {
      toast({
        title: "处理失败",
        description: operation === 'decode' ? '请输入有效的Base64字符串' : '编码失败',
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    copyText(output);
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

  const loadSample = () => {
    if (operation === 'encode') {
      setInput("Hello World! 你好世界 🌍");
    } else {
      setInput("SGVsbG8gV29ybGQhIOivmeWlveS4lueVjCDwn42N");
    }
    setOutput("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (operation === 'encode') {
          setInput(result);
        } else {
          setInput(btoa(result));
        }
      };
      
      if (operation === 'encode') {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Base64编解码工具</h1>
        <p className="text-muted-foreground">
          将文本或文件转换为Base64编码，或将Base64字符串解码为原始内容
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button 
                variant={operation === 'encode' ? 'default' : 'outline'}
                onClick={() => setOperation('encode')}
              >
                <Upload className="w-4 h-4 mr-2" />
                编码
              </Button>
              <Button 
                variant={operation === 'decode' ? 'default' : 'outline'}
                onClick={() => setOperation('decode')}
              >
                <Download className="w-4 h-4 mr-2" />
                解码
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={processString} variant="success">
                <Code className="w-4 h-4 mr-2" />
                {operation === 'encode' ? '编码' : '解码'}
              </Button>
              <Button onClick={swapInputOutput} variant="outline">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                交换
              </Button>
              <Button onClick={loadSample} variant="ghost">
                <FileText className="w-4 h-4 mr-2" />
                示例
              </Button>
              <Button onClick={clearAll} variant="ghost">
                <RotateCcw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>

            <div className="ml-auto">
              <Button asChild variant="outline" size="sm">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  上传文件
                </label>
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>
              {operation === 'encode' ? '原始文本' : 'Base64字符串'}
            </CardTitle>
            <CardDescription>
              {operation === 'encode' 
                ? '输入需要编码的文本内容' 
                : '输入需要解码的Base64字符串'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={operation === 'encode' 
                ? '输入文本内容...' 
                : '输入Base64字符串...'
              }
              className="min-h-80 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {operation === 'encode' ? 'Base64编码结果' : '解码结果'}
              {output && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {operation === 'encode' 
                ? '编码后的Base64字符串' 
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
          <CardTitle>Base64编码说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">什么是Base64？</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Base64是一种基于64个可打印字符来表示二进制数据的表示方法。
                常用于在网络传输中编码二进制数据，如图片、文件等。
              </p>
              
              <h4 className="font-medium mb-2">使用场景</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 邮件附件编码</li>
                <li>• 网页中嵌入图片数据</li>
                <li>• API数据传输</li>
                <li>• 配置文件中的二进制数据</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">编码特点</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• 使用A-Z、a-z、0-9、+、/ 共64个字符</li>
                <li>• 每3个字节转换为4个Base64字符</li>
                <li>• 编码后数据大小约增加33%</li>
                <li>• 支持padding字符"="补齐</li>
              </ul>
              
              <h4 className="font-medium mb-2">注意事项</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 不是加密算法，只是编码方式</li>
                <li>• 解码时需要确保输入格式正确</li>
                <li>• 支持中文等Unicode字符</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}