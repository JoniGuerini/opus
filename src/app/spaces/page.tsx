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
import { DynamicIcon } from "@/components/dynamic-icon"
import { CreateSpaceDialog, EditSpaceDialog } from "@/components/forms"
import { FolderOpen, Plus, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { TERMINOLOGY } from "@/constants/terminology"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertConfirm } from "@/components/ui/alert-confirm"

export default function SpacesPage() {
    const { spaces, getSpaceProjects, isLoaded, deleteSpace } = useApp()

    if (!isLoaded) {
        return (
            <div className="space-y-8">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-40" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            {/* Header */}
            <div className="flex justify-end">
                <CreateSpaceDialog />
            </div>

            {/* Workspaces Grid */}
            {spaces.length === 0 ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderOpen />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum {TERMINOLOGY.WORKSPACE_LOWER} encontrado</EmptyTitle>
                        <EmptyDescription>
                            Crie seu primeiro {TERMINOLOGY.WORKSPACE_LOWER} para começar a organizar seus projetos.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateSpaceDialog
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar {TERMINOLOGY.WORKSPACE}
                                </Button>
                            }
                        />
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {spaces.map((space) => {
                        const projects = getSpaceProjects(space.id)
                        return (
                            <div key={space.id} className="relative group">
                                <Link
                                    href={`/spaces/${space.id}`}
                                    className="block h-full"
                                >
                                    <div className="h-full rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                <FolderOpen className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                            {space.name}
                                        </h3>
                                        {space.description && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {space.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium text-foreground">{projects.length}</span> projetos
                                            </div>
                                        </div>
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
                                            <EditSpaceDialog
                                                space={space}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Editar
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <AlertConfirm
                                                onConfirm={() => deleteSpace(space.id)}
                                                title={`Excluir ${TERMINOLOGY.WORKSPACE}?`}
                                                description={`Isso excluirá permanentemente o ${TERMINOLOGY.WORKSPACE_LOWER} "${space.name}" e todos os seus projetos, épicos e tarefas.`}
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
