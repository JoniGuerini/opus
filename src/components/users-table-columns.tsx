
"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash2, ArrowUpDown } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

import { User, UserRole, UserStatus } from "@/types"
import { useApp } from "@/contexts/app-context"
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "@/constants/user-options"
import { EditUserDialog } from "@/components/forms"
import { AlertConfirm } from "@/components/ui/alert-confirm"

// Helpers
const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
        case "member":
            return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
        case "viewer":
            return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
        default:
            return "bg-slate-100 text-slate-500"
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-500"
        case "busy":
            return "bg-red-500"
        case "away":
            return "bg-orange-500"
        case "offline":
            return "bg-slate-300"
        default:
            return "bg-slate-300"
    }
}

const getStatusLabel = (status: string) => {
    return USER_STATUS_OPTIONS.find(s => s.value === status)?.label || status
}

export const columns: ColumnDef<User>[] = [
    {
        id: "drag",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="" />
        ),
        cell: () => null, // The cell content is handled in DraggableRow
        enableSorting: false,
        enableHiding: false,
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
        accessorKey: "fullName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Usuário" />
        ),
        cell: ({ row }) => {
            const user = row.original
            const initials = (user.fullName || "N A")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)

            return (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.fullName || "Sem Nome"}</span>
                        <span className="text-xs text-muted-foreground">{user.jobTitle}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "globalRole",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cargo" />
        ),
        cell: ({ row }) => {
            const role = row.getValue("globalRole") as string
            const label = USER_ROLE_OPTIONS.find(r => r.value === role)?.label || role

            return (
                <Badge variant="secondary" className={getRoleBadgeColor(role)}>
                    {label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="flex items-center gap-2 text-sm">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
                    <span>{getStatusLabel(status)}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "level",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nível" />
        ),
        cell: ({ row }) => <div className="text-center font-medium text-muted-foreground">{row.getValue("level")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            const { deleteUser } = useApp()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.email)}
                        >
                            Copiar Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <EditUserDialog
                            user={user}
                            trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Editar
                                </DropdownMenuItem>
                            }
                        />
                        <AlertConfirm
                            onConfirm={() => deleteUser(user.id)}
                            title="Remover Usuário?"
                            description={`Isso removerá permanentemente ${user.fullName} da organização.`}
                            trigger={
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remover
                                </DropdownMenuItem>
                            }
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
