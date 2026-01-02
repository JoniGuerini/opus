
"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
} from "@tanstack/react-table"
import { GripVertical } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { UsersTableToolbar } from "./users-table-toolbar"
import { DataTablePagination } from "@/components/ui/pagination"

interface UsersDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    setData?: React.Dispatch<React.SetStateAction<TData[]>>
    toolbarAction?: React.ReactNode
}

// --- Draggable Row Component ---
const DraggableRow = ({ row }: { row: Row<any> }) => {
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

export function UsersDataTable<TData, TValue>({
    columns,
    data,
    setData,
    toolbarAction,
}: UsersDataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])

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

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id && setData) {
            setData((currentData) => {
                const oldIndex = currentData.findIndex((item: any) => item.id === active.id)
                const newIndex = currentData.findIndex((item: any) => item.id === over?.id)

                return arrayMove(currentData, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="space-y-4">
            <UsersTableToolbar table={table}>
                {toolbarAction}
            </UsersTableToolbar>
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
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan}>
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
                                items={data.map((d: any) => d.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            Nenhum usuário encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
