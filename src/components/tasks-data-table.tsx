"use client"

import * as React from "react"
import {
    Table as TanStackTable,
    flexRender,
} from "@tanstack/react-table"
import {
    GripVertical,
} from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Task } from "@/types"

// --- Draggable Row Component ---
interface DraggableRowProps {
    row: any // Type issue with Row<Task> import? I'll use any or import Row
}
// Import Row type
import { Row } from "@tanstack/react-table"

const DraggableRow = ({ row }: { row: Row<Task> }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: row.original.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative' as const,
    }

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {cell.column.id === "drag" ? (
                        <Button
                            variant="ghost"
                            {...attributes}
                            {...listeners}
                            className="p-1 h-6 w-6 cursor-grab active:cursor-grabbing hover:bg-muted"
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </TableCell>
            ))}
        </TableRow>
    )
}

interface TasksDataTableProps {
    table: TanStackTable<Task>
    data: Task[]
    setData: React.Dispatch<React.SetStateAction<Task[]>>
}

export function TasksDataTable({ table, data, setData }: TasksDataTableProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            setData((currentData) => {
                const oldIndex = currentData.findIndex((item) => item.id === active.id)
                const newIndex = currentData.findIndex((item) => item.id === over?.id)

                return arrayMove(currentData, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="rounded-md border">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            <SortableContext
                                items={data.map(d => d.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={table.getAllColumns().length}
                                            className="h-24 text-center"
                                        >
                                            Nenhuma tarefa encontrada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Linhas por página</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    )
}
