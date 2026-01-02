"use client"

import { MoreHorizontal, Folder, Share, Trash2, Layers } from "lucide-react"
import Link from "next/link"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "@/components/ui/sidebar"
import { useApp } from "@/contexts/app-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

export function NavSpaces() {
    const { spaces, deleteSpace } = useApp()
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible asChild defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip="Spaces">
                                <Layers />
                                <span>Spaces</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {spaces.map((space) => (
                                    <SidebarMenuSubItem key={space.id}>
                                        <SidebarMenuSubButton asChild>
                                            <Link href={`/spaces/${space.id}`}>
                                                <Folder />
                                                <span>{space.name}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuAction showOnHover>
                                                    <MoreHorizontal />
                                                    <span className="sr-only">More</span>
                                                </SidebarMenuAction>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-48 rounded-lg bg-[#262626] text-white"
                                                side={isMobile ? "bottom" : "right"}
                                                align={isMobile ? "end" : "start"}
                                            >
                                                <DropdownMenuItem>
                                                    <Folder className="text-muted-foreground mr-2 size-4" />
                                                    <span>View Space</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share className="text-muted-foreground mr-2 size-4" />
                                                    <span>Share Space</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-800" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteSpace(space.id)}
                                                    className="text-red-500 focus:text-red-500 focus:bg-red-950/20"
                                                >
                                                    <Trash2 className="mr-2 size-4" />
                                                    <span>Delete Space</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuSubItem>
                                ))}
                                {spaces.length === 0 && (
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton className="pointer-events-none opacity-50">
                                            <span className="text-muted-foreground text-xs">No spaces found</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    )
}
