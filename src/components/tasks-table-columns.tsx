"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, CircleDashed } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Task, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types"
import { useApp } from "@/contexts/app-context"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/constants/task-options"
import { EditTaskDialog } from "@/components/forms"
import { getLabelColorClass } from "@/lib/utils-colors"
import { TaskActionsMenu } from "@/components/task-actions-menu"
import { StatusSelect } from "@/components/task-selectors/status-select"
import { PrioritySelect } from "@/components/task-selectors/priority-select"


export const columns: ColumnDef<Task>[] = [
    {
        id: "drag",
        header: "",
        size: 40,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => null, // Placeholder, actual drag handle rendered in Row
    },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tarefa" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "labels",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Labels" />
        ),
        cell: ({ row }) => {
            const labelsMap = row.original.labelEntities || []
            return (
                <div className="flex gap-1 flex-wrap">
                    {labelsMap.map((label) => (
                        <Badge
                            key={label.id}
                            variant="secondary"
                            className={`text-white border-0 ${getLabelColorClass(label.color)}`}
                        >
                            {label.name}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const { updateTask } = useApp()

            return (
                <StatusSelect
                    value={status}
                    onValueChange={(value) => updateTask(row.original.id, { status: value as any })}
                    className="h-8 w-[150px]"
                />
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Prioridade" />
        ),
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            const { updateTask } = useApp()

            return (
                <PrioritySelect
                    value={priority}
                    onValueChange={(value) => updateTask(row.original.id, { priority: value as any })}
                    className="h-8 w-[120px]"
                />
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "assigneeId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Responsável" />
        ),
        cell: ({ row }) => {
            const assigneeId = row.getValue("assigneeId") as string | undefined
            const { users, updateTask } = useApp()

            return (
                <Select
                    value={assigneeId || "unassigned"}
                    onValueChange={(value) => {
                        const newAssigneeId = value === "unassigned" ? null : value
                        updateTask(row.original.id, { assigneeId: newAssigneeId as string | null | undefined })
                    }}
                >
                    <SelectTrigger className="h-8 w-[140px] border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Sem responsável">
                            {assigneeId && users.find(u => u.id === assigneeId) ? (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={users.find(u => u.id === assigneeId)?.avatarUrl} />
                                        <AvatarFallback className="bg-primary text-[10px] text-primary-foreground font-medium">
                                            {users.find(u => u.id === assigneeId)?.fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{users.find(u => u.id === assigneeId)?.fullName.split(' ')[0]}</span>
                                </div>
                            ) : "Sem responsável"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start">
                        <SelectItem value="unassigned">Sem responsável</SelectItem>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                        <AvatarFallback className="bg-primary text-[10px] text-primary-foreground font-medium">
                                            {user.fullName ? user.fullName.charAt(0) : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{user.fullName ? user.fullName.split(' ')[0] : "Usuário"}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <TaskActionsMenu task={row.original} />
            )
        },
    },
]
