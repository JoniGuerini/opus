"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useApp } from "@/contexts/app-context"

export function TeamSwitcher() {
    const { isMobile } = useSidebar()
    const { company, companies, setSelectedCompanyId } = useApp()

    // Map logos to components if needed, for now we will use dynamic icons or text
    // Since the mock data has strings for logos like "GalleryVerticalEnd", we need a way to render them.
    // For simplicity, let's assume we render a placeholder or look up an icon.
    // I'll import some icons to map them.

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {/* We could dynamically render icon here. For now, let's use the first letter or a generic icon */}
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-sidebar-primary-foreground">
                                    <span className="font-bold">{company.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {company.name}
                                </span>
                                <span className="truncate text-xs">Enterprise</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={18}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Teams
                        </DropdownMenuLabel>
                        {companies.map((team, index) => (
                            <DropdownMenuItem
                                key={team.name}
                                onClick={() => setSelectedCompanyId(team.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <span className="text-xs font-bold">{team.name.charAt(0)}</span>
                                </div>
                                {team.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add team</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
