"use client"

export const dynamic = 'force-dynamic'

import { useApp } from "@/contexts/app-context"
import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TasksView } from "@/components/tasks-view"
import { EditEpicDialog } from "@/components/forms"
import { CreateLabelDialog } from "@/components/forms/create-label-dialog"
import { AlertConfirm } from "@/components/ui/alert-confirm"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Settings, Trash2, Tag } from "lucide-react"

interface PageProps {
    params: Promise<{ spaceId: string; projectId: string; epicId: string }>
}

export default function EpicDetailPage({ params }: PageProps) {
    const { spaceId, projectId, epicId } = use(params)
    const router = useRouter()
    const { epics, getEpicTasks, isLoaded, deleteEpic } = useApp()

    if (!isLoaded) {
        return <Skeleton className="h-[500px] w-full" />
    }

    const epic = epics.find(e => e.id === epicId)

    if (!epic) {
        notFound()
    }

    const tasks = getEpicTasks(epic.id)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{epic.title}</h1>
                    {epic.summary && <p className="text-muted-foreground">{epic.summary}</p>}
                </div>
                <div className="flex items-center gap-2">
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
                                Gerenciar Épico
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <EditEpicDialog
                                epic={epic}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        Editar Épico
                                    </DropdownMenuItem>
                                }
                            />
                            <AlertConfirm
                                onConfirm={() => {
                                    deleteEpic(epic.id)
                                    router.push(`/spaces/${spaceId}/projects/${projectId}`)
                                }}
                                title="Excluir Épico?"
                                description={`Isso excluirá permanentemente o épico "${epic.title}" e todas as suas tarefas.`}
                                trigger={
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir Épico
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <TasksView tasks={tasks} epicId={epic.id} />
        </div>
    )
}
