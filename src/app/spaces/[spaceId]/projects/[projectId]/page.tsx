"use client"

export const dynamic = 'force-dynamic'

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
import { Layers, Plus, CheckCircle2, Clock, AlertCircle, Tag } from "lucide-react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertConfirm } from "@/components/ui/alert-confirm"
import { CreateEpicDialog, EditEpicDialog, EditProjectDialog } from "@/components/forms"
import { CreateLabelDialog } from "@/components/forms/create-label-dialog"
import { MoreVertical, Trash2, Settings } from "lucide-react"

interface PageProps {
    params: Promise<{ spaceId: string; projectId: string }>
}

export default function ProjectDetailPage({ params }: PageProps) {
    const { projectId, spaceId } = use(params)
    const router = useRouter()
    const { projects, spaces, getProjectEpics, getEpicTasks, isLoaded, deleteProject, deleteEpic } = useApp()

    if (!isLoaded) {
        return (
            <div className="space-y-8">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    const project = projects.find(p => p.id === projectId)

    if (!project) {
        notFound()
    }

    const space = spaces.find(ws => ws.id === project.spaceId)
    const epics = getProjectEpics(project.id)

    // Calculate progress for each epic
    const getEpicProgress = (epicId: string) => {
        const tasks = getEpicTasks(epicId)
        if (tasks.length === 0) return { total: 0, done: 0, progress: 0, status: 'todo' as const }
        const done = tasks.filter(t => t.status === 'done').length
        const progress = Math.round((done / tasks.length) * 100)

        let status: 'todo' | 'in-progress' | 'completed' = 'in-progress'
        if (progress === 0) status = 'todo'
        if (progress === 100) status = 'completed'

        return { total: tasks.length, done, progress, status }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-end gap-2">
                <CreateLabelDialog
                    spaceId={spaceId}
                    trigger={
                        <Button variant="outline">
                            <Tag className="mr-2 h-4 w-4" />
                            Criar Label
                        </Button>
                    }
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Gerenciar Projeto
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <EditProjectDialog
                            project={project}
                            trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Editar Projeto
                                </DropdownMenuItem>
                            }
                        />
                        <AlertConfirm
                            onConfirm={() => {
                                deleteProject(project.id)
                                router.push(`/spaces/${project.spaceId}`)
                            }}
                            title="Excluir Projeto?"
                            description={`Isso excluirá permanentemente o projeto "${project.name}" e todos os seus dados.`}
                            trigger={
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir Projeto
                                </DropdownMenuItem>
                            }
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
                <CreateEpicDialog projectId={project.id} />
            </div>

            {/* Epics List */}
            {epics.length === 0 ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Layers />
                        </EmptyMedia>
                        <EmptyTitle>Nenhum épico encontrado</EmptyTitle>
                        <EmptyDescription>
                            Crie seu primeiro épico para começar a organizar as tarefas do projeto.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateEpicDialog
                            projectId={project.id}
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar Épico
                                </Button>
                            }
                        />
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="space-y-4">
                    {epics.map((epic) => {
                        const { total, done, progress, status } = getEpicProgress(epic.id)
                        return (
                            <div key={epic.id} className="relative group/epic">
                                <Link
                                    href={`/spaces/${spaceId}/projects/${project.id}/epics/${epic.id}`}
                                    className="block h-full"
                                >
                                    <div className="h-full rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${status === 'completed'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : status === 'in-progress'
                                                            ? 'bg-blue-500/10 text-blue-500'
                                                            : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> :
                                                            status === 'in-progress' ? <Clock className="h-3 w-3" /> :
                                                                <AlertCircle className="h-3 w-3" />}
                                                        {status === 'completed' ? 'Concluído' :
                                                            status === 'in-progress' ? 'Em Progresso' : 'A Fazer'}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-lg group-hover/epic:text-primary transition-colors">
                                                    {epic.title}
                                                </h3>
                                                {epic.summary && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {epic.summary}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right ml-6">
                                                <div className="text-2xl font-bold">{progress}%</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {done}/{total} tarefas
                                                </div>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>

                                <div className="absolute top-4 right-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover/epic:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <EditEpicDialog
                                                epic={epic}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Editar
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            <AlertConfirm
                                                onConfirm={() => deleteEpic(epic.id)}
                                                title="Excluir Épico?"
                                                description={`Isso excluirá permanentemente o épico "${epic.title}" e todas as suas tarefas.`}
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
