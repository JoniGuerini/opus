"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/contexts/app-context"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { TERMINOLOGY } from "@/constants/terminology"

export function DynamicBreadcrumb() {
    const pathname = usePathname()
    const { spaces, projects, epics } = useApp()

    // Parse the current path
    const segments = pathname.split("/").filter(Boolean)

    // Build breadcrumb items based on path
    const items: { label: string; href?: string }[] = []

    if (segments[0] === "spaces") {
        items.push({ label: TERMINOLOGY.WORKSPACES, href: "/spaces" })

        if (segments[1]) {
            const space = spaces.find((ws) => ws.id === segments[1])
            if (space) {
                items.push({ label: space.name, href: `/spaces/${space.id}` })

                // Handle nested projects
                if (segments[2] === "projects" && segments[3]) {
                    const project = projects.find((p) => p.id === segments[3])
                    if (project) {
                        items.push({ label: project.name, href: `/spaces/${space.id}/projects/${project.id}` })

                        // Handle nested epics
                        if (segments[4] === "epics" && segments[5]) {
                            const epic = epics.find((e) => e.id === segments[5])
                            if (epic) {
                                items.push({ label: epic.title })
                            }
                        }
                    }
                }
            }
        }
    } else if (pathname === "/") {
        items.push({ label: "Dashboard" })
    } else if (pathname === "/typography") {
        items.push({ label: "Typography" })
    } else if (pathname === "/components") {
        items.push({ label: "Componentes" })
    } else if (pathname === "/profile") {
        items.push({ label: "Meu perfil" })
    } else if (pathname === "/for-you") {
        items.push({ label: "Para você" })
    } else if (pathname === "/team") {
        items.push({ label: "Equipe" })
    }

    // Don't render if no items or just one item
    if (items.length === 0) {
        return null
    }

    return (
        <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1
                        return (
                            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2.5">
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href!}>{item.label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </span>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </>
    )
}
