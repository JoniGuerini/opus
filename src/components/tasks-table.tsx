"use client"

import { useApp } from "@/contexts/app-context"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, CircleDashed } from "lucide-react"
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS, Task } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TasksTableProps {
    tasks: Task[]
    showEpicColumn?: boolean
    showProjectColumn?: boolean
}

export function TasksTable({ tasks, showEpicColumn = true, showProjectColumn = true }: TasksTableProps) {
    const { epics, projects, spaces, getUserById } = useApp()

    // Get epic and project info for each task
    const getTaskContext = (epicId: string) => {
        const epic = epics.find(e => e.id === epicId)
        if (!epic) return { epicName: "—", projectName: "—", workspaceName: "—" }

        const project = projects.find(p => p.id === epic.projectId)
        if (!project) return { epicName: epic.title, projectName: "—", spaceName: "—" }

        const space = spaces.find(ws => ws.id === project.spaceId)
        return {
            epicName: epic.title,
            projectName: project.name,
            spaceName: space?.name || "—"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case 'in-progress':
                return <Clock className="h-4 w-4 text-blue-500" />
            case 'review':
                return <AlertCircle className="h-4 w-4 text-orange-500" />
            default:
                return <CircleDashed className="h-4 w-4 text-muted-foreground" />
        }
    }

    const getStatusLabel = (status: string) => {
        return TASK_STATUS_OPTIONS.find(s => s.value === status)?.label || status
    }

    const getPriorityBadge = (priority: string) => {
        const option = TASK_PRIORITY_OPTIONS.find(p => p.value === priority)
        const colorMap: Record<string, string> = {
            'low': 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20',
            'medium': 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
            'high': 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
            'urgent': 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        }
        return (
            <Badge variant="outline" className={colorMap[priority] || ''}>
                {option?.label || priority}
            </Badge>
        )
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Tarefa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prioridade</TableHead>
                        {showEpicColumn && <TableHead>Épico</TableHead>}
                        {showProjectColumn && <TableHead>Projeto</TableHead>}
                        <TableHead>Responsável</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => {
                        const context = getTaskContext(task.epicId)
                        const assignee = task.assigneeId ? getUserById(task.assigneeId) : null

                        return (
                            <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{task.title}</span>
                                        {task.labels.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {task.labels.slice(0, 2).map((label) => (
                                                    <span
                                                        key={label}
                                                        className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                                {task.labels.length > 2 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +{task.labels.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(task.status)}
                                        <span className="text-sm">
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getPriorityBadge(task.priority)}
                                </TableCell>
                                {showEpicColumn && (
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {context.epicName}
                                        </span>
                                    </TableCell>
                                )}
                                {showProjectColumn && (
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {context.projectName}
                                        </span>
                                    </TableCell>
                                )}
                                <TableCell>
                                    {assignee ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={assignee.avatarUrl} alt={assignee.fullName} />
                                                <AvatarFallback className="bg-primary text-xs text-primary-foreground font-medium">
                                                    {assignee.fullName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">
                                                {assignee.fullName.split(' ')[0]}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
