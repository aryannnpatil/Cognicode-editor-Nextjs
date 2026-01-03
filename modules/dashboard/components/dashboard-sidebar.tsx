"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  LayoutDashboard,
  FolderPlus,
  History,
  Star,
  Plus,
  Settings,
} from "lucide-react";

import {
  SiReact,
  SiNextdotjs,
  SiExpress,
  SiDjango,
  SiVuedotjs,
  SiHono,
  SiAngular,
} from "react-icons/si";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Image from "next/image";

// ----------------------------
// Types
// ----------------------------
interface PlaygroundData {
  id: string;
  name: string;
  icon: string; // REACT, NEXTJS, EXPRESS, ...
  starred: boolean;
}

// ----------------------------
// React Icons Map
// ----------------------------
const technologyIconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  REACT: SiReact,
  NEXTJS: SiNextdotjs,
  EXPRESS: SiExpress,
  DJANGO: SiDjango,
  VUE: SiVuedotjs,
  HONO: SiHono,
  ANGULAR: SiAngular,
};

// ----------------------------
// Component
// ----------------------------
export function DashboardSidebar({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundData[];
}) {
  const pathname = usePathname();

  const [starredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred)
  );
  const [recentPlaygrounds] = useState(initialPlaygroundData);

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-center px-4 py-3">
          <Image src="/logo.svg" alt="logo" height={60} width={60} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Home">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* STARRED */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="h-4 w-4 mr-2" />
            Starred
          </SidebarGroupLabel>

          <SidebarGroupAction title="Add starred playground">
            <Plus className="h-4 w-4" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <div className="text-center text-muted-foreground py-4 w-full">
                  No starred playgrounds
                </div>
              ) : (
                starredPlaygrounds.map((pg) => {
                  const Icon = technologyIconMap[pg.icon];

                  return (
                    <SidebarMenuItem key={pg.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${pg.id}`}
                        tooltip={pg.name}
                      >
                        <Link href={`/playground/${pg.id}`}>
                          {Icon && <Icon size={16} />}
                          <span>{pg.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* RECENT */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="h-4 w-4 mr-2" />
            Recent
          </SidebarGroupLabel>

          <SidebarGroupAction title="Create new playground">
            <FolderPlus className="h-4 w-4" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {recentPlaygrounds.map((pg) => {
                const Icon = technologyIconMap[pg.icon];

                return (
                  <SidebarMenuItem key={pg.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/playground/${pg.id}`}
                      tooltip={pg.name}
                    >
                      <Link href={`/playground/${pg.id}`}>
                        {Icon && <Icon size={16} />}
                        <span>{pg.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link href="/playgrounds">
                    <span className="text-sm text-muted-foreground">
                      View all playgrounds
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
