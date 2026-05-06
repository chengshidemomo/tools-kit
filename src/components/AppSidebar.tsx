import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Braces,
  Clock,
  Code,
  Database,
  FileText,
  Fingerprint,
  Home,
  Link,
  Network,
  QrCode,
  Regex,
  Shuffle,
  Sparkles,
  Timer,
} from "lucide-react";

const toolsItems = [
  { title: "JSON格式化", url: "/json-formatter", icon: Braces, description: "JSON美化和验证" },
  { title: "SQL美化", url: "/sql-formatter", icon: Database, description: "格式化与IN列表" },
  { title: "正则测试器", url: "/regex", icon: Regex, description: "实时匹配与分组" },
  { title: "时间戳转换", url: "/timestamp", icon: Clock, description: "Unix时间互转" },
  { title: "Cron表达式", url: "/cron", icon: Timer, description: "解析与下次执行" },
  { title: "ID生成器", url: "/id-generator", icon: Fingerprint, description: "UUID与雪花ID" },
  { title: "二维码生成", url: "/qrcode", icon: QrCode, description: "实时生成QR码" },
  { title: "字符串转义", url: "/string-escape", icon: FileText, description: "字符串编码转换" },
  { title: "随机字符串", url: "/random-string", icon: Shuffle, description: "生成随机密码/Token" },
  { title: "设备编号转IP", url: "/device-to-ip", icon: Network, description: "15位编号转IP" },
  { title: "Base64编解码", url: "/base64", icon: Code, description: "Base64转换" },
  { title: "URL编解码", url: "/url-encode", icon: Link, description: "URL编码转换" },
];

const mainItems = [
  { title: "首页", url: "/", icon: Home },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-secondary/80 transition-colors";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-border bg-background`}
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">工具合集</h1>
              <p className="text-xs text-muted-foreground">现代化开发工具</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            导航
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink 
                    to={item.url} 
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavCls({ isActive })}`}
                    end
                  >
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="ml-0">{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            开发工具
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink 
                    to={item.url} 
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavCls({ isActive })}`}
                    end
                  >
                    <item.icon className="w-5 h-5" />
                    {!collapsed && (
                      <div className="ml-0 flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}