"use client"

import { useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    closestCorners,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, User, MoreVertical } from "lucide-react"

import { Task, TaskStatus, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types"
import { useApp } from "@/contexts/app-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLabelColorClass } from "@/lib/utils-colors"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { TaskActionsMenu } from "@/components/task-actions-menu"

interface KanbanBoardProps {
    tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
    const { updateTask } = useApp()

    // Determine columns from options
    // We need stable column IDs
    const columns = useMemo(() => TASK_STATUS_OPTIONS.map(o => o.value), [])

    // We need to group tasks by status for the SortableContexts
    // But we also need detailed control during drag.
    // So we use a local representation of "tasks by column" for the UI state?
    // Or just filter on the fly?
    // Filter on the fly is choppy for DragOver.
    // Recommended: Memoized map of status -> tasks[].

    // BUT to support dragging beteween columns, we need to Optimistically update this map on `onDragOver`.
    // So we need State.

    // NOTE: If we modify 'tasks' (prop) via updateTask, parent re-renders, and we get new props.
    // So if onDragOver modifies local state, onDragEnd commits to DB.

    // Let's implement activeTask and localTasks state.
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    function onDragStart(event: DragStartEvent) {
        const { active } = event
        const task = tasks.find(t => t.id === active.id)
        if (task) setActiveTask(task)
    }

    function onDragOver(event: DragOverEvent) {
        // We typically handle reordering here for the visual effect
        // But since we are relying on 'tasks' prop which we can't mutate instantaneously without flickering if we wait for parent,
        // we might leave visual reordering for "same column" to the SortableContext defaults (which need array order),
        // and "different column" requires identifying the target.

        // Simple 1.0 Implementation:
        // Just rely on DragOverlay for the "Ghost".
        // Don't optimize the "hole" opening in other columns yet (requires complex local state).
        // Just allow dropping.
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeTask = tasks.find(t => t.id === activeId)
        if (!activeTask) return

        // Check if over is a Column
        if (columns.includes(overId as TaskStatus)) {
            // Dropped on a column directly
            const newStatus = overId as TaskStatus
            if (activeTask.status !== newStatus) {
                updateTask(activeTask.id, { status: newStatus })
            }
            return
        }

        // Check if over is a Task
        const overTask = tasks.find(t => t.id === overId)
        if (overTask) {
            const newStatus = overTask.status
            if (activeTask.status !== newStatus) {
                updateTask(activeTask.id, { status: newStatus })
            }
            // Handle reordering logic here if desired (ranking)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="grid grid-cols-3 gap-4 h-full">
                {TASK_STATUS_OPTIONS.map((column) => (
                    <KanbanColumn
                        key={column.value}
                        status={column.value}
                        title={column.label}
                        tasks={tasks.filter(t => t.status === column.value)}
                    />
                ))}
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}

interface KanbanColumnProps {
    status: TaskStatus
    title: string
    tasks: Task[]
}

function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
    // SortableContext needs identifiers
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks])



    // We use DndContext's `useDroppable` for the column if we just want to drop on it.
    // OR we relies on the items inside.
    // If column is empty, we must have a droppable area.

    // Let's use `useDroppable` for the column container.
    // Wait, imports didn't include `useDroppable`. I'll import it.

    // But `SortableContext` usage is standard.
    // If I want to drop into an empty list, the container (ScrollArea) must be droppable.

    return (
        <div className="flex flex-col h-full rounded-md border bg-muted/20">
            <div className="flex items-center justify-between p-3 border-b bg-muted/40">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <span className="text-xs bg-background px-2 py-0.5 rounded-full border">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <TaskDroppableColumn status={status} tasks={tasks}>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-3 p-3 min-h-[150px]">
                        {tasks.map((task) => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>
            </TaskDroppableColumn>
        </div>
    )
}

// Helper to make the ScrollArea droppable
import { useDroppable } from "@dnd-kit/core"

function TaskDroppableColumn({ status, tasks, children }: { status: string, tasks: Task[], children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({
        id: status,
    })

    return (
        <ScrollArea className="flex-1" ref={setNodeRef}>
            {children}
        </ScrollArea>
    )
}


interface KanbanCardProps {
    task: Task
    isOverlay?: boolean
}

function KanbanCard({ task, isOverlay }: KanbanCardProps) {
    const { getUserById } = useApp()

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.0 : 1, // Hide original when dragging (overlay shows)
    }

    // If isOverlay, force opacity 1 and maybe scale
    if (isOverlay) {
        // style.transform = undefined; // Overlay handles positioning
        // style.opacity = 1
        // We render a clean card for overlay, no hooks needed usually if pure UI.
        // But here we reuse component. 
        // We should skip useSortable if overlay.
        return <TaskCardUI task={task} isOverlay />
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCardUI task={task} />
        </div>
    )
}

function TaskCardUI({ task, isOverlay }: { task: Task, isOverlay?: boolean }) {
    const { getUserById, deleteTask, labels } = useApp()
    const assignee = task.assigneeId ? getUserById(task.assigneeId) : null

    const getPriorityColor = (priority: string) => {
        return TASK_PRIORITY_OPTIONS.find(p => p.value === priority)?.color || 'bg-slate-500'
    }

    return (
        <div
            className={`rounded-lg border bg-card p-4 hover:border-primary transition-colors cursor-grab active:cursor-grabbing ${isOverlay ? 'shadow-xl border-primary scale-105 rotate-2' : ''}`}
        >
            <div className="flex items-start justify-between mb-2">
                {/* Priority indicator */}
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <span className="text-xs text-muted-foreground capitalize">
                        {TASK_PRIORITY_OPTIONS.find(p => p.value === task.priority)?.label}
                    </span>
                </div>

                {!isOverlay && (
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        <TaskActionsMenu
                            task={task}
                            trigger={
                                <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>

            {/* Title */}
            <h4 className="font-medium text-sm mb-2">{task.title}</h4>

            {/* Labels */}
            {(task.labelEntities && task.labelEntities.length > 0) ? (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.labelEntities.map((label) => (
                        <span
                            key={label.id}
                            className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${getLabelColorClass(label.color)}`}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            ) : (task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {task.labels.map((labelName) => {
                        const labelObj = labels.find(l => l.name === labelName)
                        const colorClass = getLabelColorClass(labelObj?.color)

                        return (
                            <span
                                key={labelName}
                                className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${colorClass}`}
                            >
                                {labelName}
                            </span>
                        )
                    })}
                </div>
            ))}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
                {assignee ? (
                    <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={assignee.avatarUrl} alt={assignee.fullName} />
                            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground font-medium">
                                {assignee.fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {assignee.fullName.split(' ')[0]}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-xs">Sem resp.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
