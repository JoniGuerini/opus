"use client"

import { useState, useEffect, useMemo } from "react"
import { ClipboardList, Plus, User, Calendar } from "lucide-react"
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Task, TaskStatus, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types"
import { CreateTaskDialog } from "@/components/forms"
import { TasksDataTable } from "@/components/tasks-data-table"
import { TasksToolbar } from "@/components/tasks-toolbar"
import { columns } from "@/components/tasks-table-columns"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { KanbanBoard } from "@/components/kanban-board"

interface TasksViewProps {
    tasks: Task[]
    epicId?: string
}

export function TasksView({ tasks, epicId }: TasksViewProps) {
    const { getUserById } = useApp()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set())
    const [priorityFilter, setPriorityFilter] = useState<Set<string>>(new Set())
    const [activeTab, setActiveTab] = useState("list")

    const filteredTasks = useMemo(() => tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter.size === 0 || statusFilter.has(task.status)
        const matchesPriority = priorityFilter.size === 0 || priorityFilter.has(task.priority)
        return matchesSearch && matchesStatus && matchesPriority
    }), [tasks, search, statusFilter, priorityFilter])

    // Table State
    const [tableData, setTableData] = useState<Task[]>(filteredTasks)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    useEffect(() => {
        setTableData(filteredTasks)
    }, [filteredTasks])

    const table = useReactTable({
        data: tableData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Even though we filter manually, keeping this safe
        getRowId: row => row.id,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })



    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="mb-4">
                    <TabsList>
                        <TabsTrigger value="list">Lista</TabsTrigger>
                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    </TabsList>
                </div>

                <div className="mb-4">
                    <TasksToolbar
                        search={search}
                        setSearch={setSearch}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                    >
                        {activeTab === 'list' && <DataTableViewOptions table={table} />}
                        <CreateTaskDialog epicId={epicId} />
                    </TasksToolbar>
                </div>

                <TabsContent value="list">
                    {filteredTasks.length === 0 ? (
                        <Empty className="border border-dashed">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ClipboardList />
                                </EmptyMedia>
                                <EmptyTitle>Nenhuma tarefa encontrada</EmptyTitle>
                                <EmptyDescription>
                                    {search || statusFilter.size > 0 || priorityFilter.size > 0
                                        ? "Tente ajustar os filtros para encontrar o que procura."
                                        : "Crie sua primeira tarefa para começar."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <CreateTaskDialog
                                    epicId={epicId}
                                    trigger={
                                        <Button variant="outline" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Criar Tarefa
                                        </Button>
                                    }
                                />
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <TasksDataTable
                            table={table}
                            data={tableData}
                            setData={setTableData}
                        />
                    )}
                </TabsContent>

                <TabsContent value="kanban" className="h-[calc(100vh-280px)]">
                    {filteredTasks.length === 0 ? (
                        <Empty className="border border-dashed h-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ClipboardList />
                                </EmptyMedia>
                                <EmptyTitle>Nenhuma tarefa encontrada</EmptyTitle>
                                <EmptyDescription>
                                    {search || statusFilter.size > 0 || priorityFilter.size > 0
                                        ? "Tente ajustar os filtros para encontrar o que procura."
                                        : "Crie sua primeira tarefa para começar."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <CreateTaskDialog
                                    epicId={epicId}
                                    trigger={
                                        <Button variant="outline" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Criar Tarefa
                                        </Button>
                                    }
                                />
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <KanbanBoard tasks={filteredTasks} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
