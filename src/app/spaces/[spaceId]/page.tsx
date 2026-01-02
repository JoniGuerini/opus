"use client"

import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CreateProjectDialog } from "@/components/forms"
import { CreateLabelDialog } from "@/components/forms/create-label-dialog"
import { FolderKanban, Plus, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertConfirm } from "@/components/ui/alert-confirm"
import { EditProjectDialog } from "@/components/forms"
import { MoreVertical, Trash2 } from "lucide-react"
import { TERMINOLOGY } from "@/constants/terminology"

interface PageProps {
    params: Promise<{ spaceId: string }>
}

export default function SpaceDetailPage({ params }: PageProps) {
    const { spaceId } = use(params)
    const { spaces, getSpaceProjects, isLoaded, deleteProject } = useApp()

    if (!isLoaded) {
        return (
            <div className="space-y-8">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    const space = spaces.find(ws => ws.id === spaceId)

    if (!space) {
        notFound()
    }

    const projects = getSpaceProjects(space.id)
    console.log("[SpaceDetailPage] Projects to render:", projects)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-end gap-2">
                <CreateLabelDialog
                    spaceId={space.id}
                    trigger={
                        <Button variant="outline">
                            <Tag className="mr-2 h-4 w-4" />
                            Criar Label
                        </Button>
                    }
                />
                <CreateProjectDialog spaceId={space.id} />
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderKanban />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum projeto encontrado</EmptyTitle>
                        <EmptyDescription>
                            Crie seu primeiro projeto neste {TERMINOLOGY.WORKSPACE_LOWER} para começar.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateProjectDialog
                            spaceId={space.id}
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar Projeto
                                </Button>
                            }
                        />
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        return (
                            <div key={project.id} className="relative group">
                                <Link
                                    href={`/spaces/${space.id}/projects/${project.id}`}
                                    className="block h-full"
                                >
                                    <div className="h-full rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary tracking-wider">
                                                {project.projectKey}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>

                                <div className="absolute top-4 right-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <EditProjectDialog
                                                project={project}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Editar
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <AlertConfirm
                                                onConfirm={() => deleteProject(project.id)}
                                                title="Excluir Projeto?"
                                                description={`Isso excluirá permanentemente o projeto "${project.name}" e todos os seus épicos e tarefas.`}
                                                trigger={
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onSelect={(e) => e.preventDefault()}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Deletar
                                                    </DropdownMenuItem>
                                                }
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
