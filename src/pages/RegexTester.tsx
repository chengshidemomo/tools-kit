import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [text, setText] = useState("联系: alice@example.com 或 bob@test.org");
  const [g, setG] = useState(true);
  const [i, setI] = useState(false);
  const [m, setM] = useState(false);
  const [s, setS] = useState(false);

  const flags = `${g ? "g" : ""}${i ? "i" : ""}${m ? "m" : ""}${s ? "s" : ""}`;

  const { error, matches, highlighted } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const found: { match: string; index: number; groups: string[] }[] = [];
      if (g) {
        for (const m of text.matchAll(re)) {
          found.push({ match: m[0], index: m.index ?? 0, groups: m.slice(1) });
        }
      } else {
        const r = re.exec(text);
        if (r) found.push({ match: r[0], index: r.index, groups: r.slice(1) });
      }
      // Build highlighted
      let html = "";
      let last = 0;
      for (const f of found) {
        html += escapeHtml(text.slice(last, f.index));
        html += `<mark class="bg-primary/30 text-foreground rounded px-0.5">${escapeHtml(f.match)}</mark>`;
        last = f.index + f.match.length;
        if (f.match.length === 0) last++;
      }
      html += escapeHtml(text.slice(last));
      return { error: null as string | null, matches: found, highlighted: html };
    } catch (e: any) {
      return { error: e.message as string, matches: [], highlighted: escapeHtml(text) };
    }
  }, [pattern, text, flags, g]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">正则测试器</h1>
        <p className="text-muted-foreground">实时测试 JavaScript 正则表达式</p>
      </div>

      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle>正则表达式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground">/</span>
            <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
            <span className="text-muted-foreground">/{flags}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <FlagSwitch label="g 全局" checked={g} onCheckedChange={setG} />
            <FlagSwitch label="i 忽略大小写" checked={i} onCheckedChange={setI} />
            <FlagSwitch label="m 多行" checked={m} onCheckedChange={setM} />
            <FlagSwitch label="s 单行(.匹配换行)" checked={s} onCheckedChange={setS} />
          </div>
          {error && <Badge variant="destructive">{error}</Badge>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>测试文本</CardTitle>
            <CardDescription>下方实时显示高亮匹配</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-40 font-mono text-sm" />
            <div
              className="min-h-20 p-3 rounded-md bg-muted/30 font-mono text-sm whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle>匹配结果 ({matches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <p className="text-muted-foreground text-sm">无匹配</p>
            ) : (
              <ol className="space-y-3 text-sm">
                {matches.map((m, idx) => (
                  <li key={idx} className="border-l-2 border-primary pl-3">
                    <div className="font-mono">
                      <span className="text-muted-foreground">#{idx + 1} @{m.index}: </span>
                      <span className="text-primary">{m.match}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                        {m.groups.map((g, i) => (
                          <div key={i}>
                            分组 ${i + 1}: <code className="bg-muted px-1 rounded">{g ?? "undefined"}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FlagSwitch({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (b: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <Label className="cursor-pointer">{label}</Label>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
