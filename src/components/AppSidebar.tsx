
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  MessagesSquare, 
  Bot, 
  Search, 
  Settings 
} from "lucide-react";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const apps = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessagesSquare,
    },
    {
      title: "AI Assistant",
      url: "/assistant",
      icon: Bot,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {apps.map((app) => (
                <SidebarMenuItem key={app.title}>
                  <SidebarMenuButton asChild>
                    <Link to={app.url} className="flex items-center gap-2">
                      <app.icon className="h-5 w-5" />
                      <span>{app.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
