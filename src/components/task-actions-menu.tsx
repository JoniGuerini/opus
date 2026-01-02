"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MoreVertical, Trash2 } from "lucide-react"
import { Task } from "@/types"
import { useApp } from "@/contexts/app-context"
import { EditTaskDialog } from "@/components/forms"
import { AlertConfirm } from "@/components/ui/alert-confirm"

interface TaskActionsMenuProps {
    task: Task
    trigger?: React.ReactNode
    align?: "start" | "end" | "center"
    sideOffset?: number
}

export function TaskActionsMenu({ task, trigger, align = "end", sideOffset = 4 }: TaskActionsMenuProps) {
    const { deleteTask } = useApp()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} sideOffset={sideOffset} onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(task.id)}
                >
                    Copiar ID da tarefa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <EditTaskDialog
                    task={task}
                    trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Ver Detalhes & Editar
                        </DropdownMenuItem>
                    }
                />
                <AlertConfirm
                    onConfirm={() => deleteTask(task.id)}
                    title="Excluir Tarefa"
                    description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
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
    )
}
