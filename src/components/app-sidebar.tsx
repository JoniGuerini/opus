"use client"

import { TERMINOLOGY } from "@/constants/terminology"
import {
    Calendar,
    Home,
    Inbox,
    Settings,
    Users,
    BarChart3,
    Zap,
    Layers,
    ChevronsUpDown,
    LogOut,
    User,
    CreditCard,
    Bell,
    Sparkles,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/contexts/app-context"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavSpaces } from "@/components/nav-spaces"

// Menu items.
const mainMenuItems = [
    {
        title: "Para você",
        url: "/for-you",
        icon: User,
    },
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
]

const teamMenuItems = [
    {
        title: "Equipe",
        url: "/team",
        icon: Users,
    },

]


export function AppSidebar() {
    const { currentUser } = useApp()

    // Helper to get initials
    const getInitials = (name?: string) => {
        if (!name) return "AS"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <NavSpaces />
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Colaboração</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {teamMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} />
                                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                                            {getInitials(currentUser.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{currentUser.fullName}</span>
                                        <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground"
                                side="right"
                                align="end"
                                sideOffset={18}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} />
                                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                                                {getInitials(currentUser.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{currentUser.fullName}</span>
                                            <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">
                                            <User className="mr-2 size-4" />
                                            Meu perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/company/profile">
                                            <Settings className="mr-2 size-4" />
                                            Perfil da Empresa
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell className="mr-2 size-4" />
                                        Notificações
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 size-4" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
