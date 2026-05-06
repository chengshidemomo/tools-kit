import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, QrCode as QrIcon } from "lucide-react";

export default function QrCodePage() {
  const [text, setText] = useState("https://lovable.dev");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin,
      errorCorrectionLevel: level,
    }).catch(() => {});
  }, [text, size, margin, level]);

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
    toast({ title: "已下载" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">二维码生成</h1>
        <p className="text-muted-foreground">输入内容即时生成二维码，支持自定义参数</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>输入内容</CardTitle>
            <CardDescription>支持URL、文本、Wi-Fi等任意字符串</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              className="min-h-40 font-mono text-sm"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>尺寸 (px)</Label>
                <Input type="number" min={64} max={1024} value={size} onChange={(e) => setSize(+e.target.value || 320)} />
              </div>
              <div className="space-y-2">
                <Label>边距</Label>
                <Input type="number" min={0} max={10} value={margin} onChange={(e) => setMargin(+e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>纠错等级</Label>
              <div className="flex gap-2">
                {(["L", "M", "Q", "H"] as const).map((l) => (
                  <Button key={l} size="sm" variant={level === l ? "default" : "outline"} onClick={() => setLevel(l)}>
                    {l}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              预览
              <Button size="sm" variant="outline" onClick={download}>
                <Download className="w-4 h-4 mr-2" />
                下载PNG
              </Button>
            </CardTitle>
            <CardDescription>实时预览生成结果</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center bg-white rounded-md p-4">
            {text ? (
              <canvas ref={canvasRef} />
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2 py-12">
                <QrIcon className="w-12 h-12" />
                请输入内容
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
