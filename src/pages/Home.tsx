import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  AudioLines,
  Braces,
  Code,
  Database,
  FileText,
  Link,
  Shuffle,
  Sparkles,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const featuredTools = [
  {
    title: "音频压缩",
    description: "高效压缩MP3和M4A音频文件，减小文件大小同时保持音质",
    icon: AudioLines,
    url: "/audio-compress",
    category: "媒体处理",
    features: ["无损压缩", "批量处理", "格式转换"]
  },
  {
    title: "JSON格式化",
    description: "美化、验证和压缩JSON数据，支持语法高亮",
    icon: Braces,
    url: "/json-formatter",
    category: "数据处理",
    features: ["语法验证", "美化格式", "压缩输出"]
  },
  {
    title: "SQL美化",
    description: "格式化SQL语句，支持MySQL、PostgreSQL等多种方言",
    icon: Database,
    url: "/sql-formatter",
    category: "数据库工具",
    features: ["多种方言", "美化压缩", "关键字高亮"]
  },
  {
    title: "字符串转义",
    description: "处理HTML、JavaScript、SQL等字符串转义",
    icon: FileText,
    url: "/string-escape",
    category: "开发工具",
    features: ["多语言支持", "批量转换", "实时预览"]
  },
];

const quickTools = [
  { title: "随机字符串", icon: Shuffle, url: "/random-string" },
  { title: "Base64编解码", icon: Code, url: "/base64" },
  { title: "URL编解码", icon: Link, url: "/url-encode" },
];

const stats = [
  { label: "总工具数", value: "20+", icon: Zap },
  { label: "安全可靠", value: "100%", icon: Shield },
  { label: "响应时间", value: "<1s", icon: Clock },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-accent rounded-full text-sm font-medium text-primary">
          <Sparkles className="w-4 h-4" />
          现代化工具合集
        </div>
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
          强大的
          <span className="text-transparent bg-clip-text bg-gradient-primary"> 开发者工具箱</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          为开发者打造的现代化工具集合，提供高效、安全、易用的在线工具，助力您的开发工作流程
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center bg-gradient-card border-0 shadow-soft">
            <CardContent className="pt-6">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Tools */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">热门工具</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTools.map((tool, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 cursor-pointer border-0 bg-gradient-card"
              onClick={() => navigate(tool.url)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tool.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-primary hover:bg-primary-hover shadow-soft"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(tool.url);
                  }}
                >
                  立即使用
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Tools */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">快捷工具</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTools.map((tool, index) => (
            <Card 
              key={index}
              className="group hover:shadow-medium transition-all duration-300 cursor-pointer border-0 bg-background hover:bg-secondary/50"
              onClick={() => navigate(tool.url)}
            >
              <CardContent className="p-6 text-center">
                <tool.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <Card className="bg-gradient-primary text-white border-0 shadow-glow">
        <CardContent className="text-center py-12">
          <h3 className="text-2xl font-bold mb-4">开始使用工具合集</h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            探索更多强大的开发工具，提升您的工作效率
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/json-formatter')}
            className="font-medium"
          >
            开始探索
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}