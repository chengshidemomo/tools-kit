import { copyText } from "@/lib/clipboard";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Shuffle } from "lucide-react";

const COMMON_SYMBOLS = ".-_+=*";
const AMBIGUOUS_SYMBOLS = "@#$%^&!?(){}[]|;:,<>/\\\"'`~";

export default function RandomString() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useCommonSymbols, setUseCommonSymbols] = useState(false);
  const [useAmbiguousSymbols, setUseAmbiguousSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const generate = () => {
    let charset = "";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useDigits) charset += "0123456789";
    if (useCommonSymbols) charset += COMMON_SYMBOLS;
    if (useAmbiguousSymbols) charset += AMBIGUOUS_SYMBOLS;
    if (excludeSimilar) charset = charset.replace(/[il1Lo0O]/g, "");

    if (!charset) {
      toast({ title: "请至少选择一种字符类型", variant: "destructive" });
      return;
    }

    const results: string[] = [];
    const cryptoObj = window.crypto;
    for (let i = 0; i < count; i++) {
      const arr = new Uint32Array(length);
      cryptoObj.getRandomValues(arr);
      let str = "";
      for (let j = 0; j < length; j++) {
        str += charset[arr[j] % charset.length];
      }
      results.push(str);
    }
    setOutput(results.join("\n"));
    toast({ title: "生成成功", description: `已生成${count}个随机字符串` });
  };

  const copy = () => {
    copyText(output);
    toast({ title: "已复制", description: "内容已复制到剪贴板" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">随机字符串生成</h1>
        <p className="text-muted-foreground">基于加密安全随机数生成密码、Token或随机字符串</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>生成选项</CardTitle>
          <CardDescription>自定义字符串长度和包含的字符类型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>长度: {length}</Label>
              <Input
                type="number"
                min={1}
                max={256}
                value={length}
                onChange={(e) => setLength(Math.min(256, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-2">
              <Label>生成数量: {count}</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <Label htmlFor="upper">大写字母 (A-Z)</Label>
              <Switch id="upper" checked={useUpper} onCheckedChange={setUseUpper} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <Label htmlFor="lower">小写字母 (a-z)</Label>
              <Switch id="lower" checked={useLower} onCheckedChange={setUseLower} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <Label htmlFor="digits">数字 (0-9)</Label>
              <Switch id="digits" checked={useDigits} onCheckedChange={setUseDigits} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <Label htmlFor="common-symbols" className="flex flex-col gap-0.5">
                <span>常见符号</span>
                <span className="text-xs text-muted-foreground font-mono">{COMMON_SYMBOLS}</span>
              </Label>
              <Switch id="common-symbols" checked={useCommonSymbols} onCheckedChange={setUseCommonSymbols} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border">
              <Label htmlFor="ambiguous-symbols" className="flex flex-col gap-0.5">
                <span>歧义符号</span>
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">@#$%^&!?...</span>
              </Label>
              <Switch id="ambiguous-symbols" checked={useAmbiguousSymbols} onCheckedChange={setUseAmbiguousSymbols} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-border md:col-span-3">
              <Label htmlFor="similar">排除易混淆字符 (i, l, 1, L, o, 0, O)</Label>
              <Switch id="similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={generate} variant="success">
              <Shuffle className="w-4 h-4 mr-2" />
              生成
            </Button>
            <Button onClick={() => setOutput("")} variant="ghost">
              <RotateCcw className="w-4 h-4 mr-2" />
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            生成结果
            {output && (
              <Button size="sm" variant="outline" onClick={copy}>
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={output}
            readOnly
            placeholder="点击生成按钮以获取随机字符串..."
            className="min-h-60 font-mono text-sm resize-none bg-muted/30"
          />
        </CardContent>
      </Card>
    </div>
  );
}
