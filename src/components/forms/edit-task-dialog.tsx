"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getLabelColorClass } from "@/lib/utils-colors"

import { Check, ChevronsUpDown, Plus, Pencil, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Task, TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/constants/task-options"
import { StatusSelect } from "@/components/task-selectors/status-select"
import { PrioritySelect } from "@/components/task-selectors/priority-select"

const taskFormSchema = z.object({
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().optional(),
    epicId: z.string().min(1, {
        message: "Selecione um épico.",
    }),
    status: z.string(),
    priority: z.string(),
    assigneeId: z.string().optional(),
    labels: z.array(z.string()).default([]),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface EditTaskDialogProps {
    task: Task
    trigger?: React.ReactNode
    onUpdated?: () => void
}

export function EditTaskDialog({ task, trigger, onUpdated }: EditTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { epics, users, updateTask, projects, labels } = useApp()
    const [spaceId, setSpaceId] = useState<string | undefined>()

    const [isLoading, setIsLoading] = useState(false)
    const [fullTask, setFullTask] = useState<any>(null)

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema) as any,
        defaultValues: {
            title: task.title,
            description: task.description || "",
            epicId: task.epicId,
            status: (task.status as any) === 'doing' ? 'in-progress' : task.status,
            priority: (task.priority as any) === 'Low' ? 'low' :
                (task.priority as any) === 'Medium' ? 'medium' :
                    (task.priority as any) === 'High' ? 'high' :
                        (task.priority as any) === 'Urgent' ? 'urgent' :
                            ((task.priority as string)?.toLowerCase() || 'medium'),
            assigneeId: task.assigneeId || "",
            labels: task.labelEntities?.map(l => l.id) || [],
        },
    })

    // Fetch fresh task data when dialog opens
    useEffect(() => {
        if (open && task.id) {
            const fetchTaskDetails = async () => {
                setIsLoading(true)
                try {
                    const response = await fetch(`/api/tasks/${task.id}`)
                    if (response.ok) {
                        const data = await response.json()
                        setFullTask(data)
                        // Reverse map status and priority from API values to internal form values
                        const statusMap: Record<string, string> = {
                            'todo': 'todo',
                            'doing': 'in-progress',
                            'done': 'done'
                        }
                        const priorityMap: Record<string, string> = {
                            'Low': 'low',
                            'Medium': 'medium',
                            'High': 'high',
                            'Urgent': 'urgent'
                        }

                        form.reset({
                            title: data.title,
                            description: data.description || "",
                            epicId: data.epicId,
                            status: statusMap[data.status] || data.status,
                            priority: priorityMap[data.priority] || (data.priority ? data.priority.toLowerCase() : 'medium'),
                            assigneeId: data.assigneeId || "",
                            labels: data.labelEntities?.map((l: any) => l.id) || [],
                        })
                    }
                } catch (error) {
                    console.error("Failed to fetch task details:", error)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchTaskDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task.id])

    // Watch Epic ID to filter labels
    const watchedEpicId = form.watch("epicId")
    useEffect(() => {
        const targetEpicId = watchedEpicId
        if (targetEpicId) {
            const epic = epics.find(e => e.id === targetEpicId)
            if (epic) {
                const project = projects.find(p => p.id === epic.projectId)
                if (project) {
                    setSpaceId(project.spaceId)
                }
            }
        } else {
            setSpaceId(undefined)
        }
    }, [watchedEpicId, epics, projects])

    const availableLabels = spaceId ? labels.filter(l => l.spaceId === spaceId) : []



    function onSubmit(values: TaskFormValues) {
        const labels = values.labels || []

        // Ensure assigneeId is undefined if empty string
        const assigneeId = values.assigneeId && values.assigneeId.trim() !== ""
            ? values.assigneeId
            : null

        const status = values.status
        const priority = values.priority

        updateTask(task.id, {
            epicId: values.epicId,
            title: values.title,
            description: values.description,
            status: status as "todo" | "in-progress" | "done",
            priority: priority as any,
            assigneeId: assigneeId,
            labels: labels,
        })

        setIsEditing(false)
        onUpdated?.()
    }

    function handleCancel() {
        // Reset form to original values
        form.reset()
        setIsEditing(false)
    }

    function handleDialogChange(isOpen: boolean) {
        setOpen(isOpen)
        if (!isOpen) {
            setIsEditing(false)
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm">Editar</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Editar Tarefa</DialogTitle>
                    <DialogDescription>
                        Visualize e edite os detalhes da sua tarefa.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-background">
                        {isLoading ? (
                            <div className="flex-1 p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="grid grid-cols-[1fr_300px] gap-8">
                                    <div className="h-[400px] w-full bg-muted/50 rounded-xl animate-pulse" />
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                                {/* Scrollable Content */}
                                <div className="p-6 space-y-6">
                                    {/* Title Section */}
                                    <div className="space-y-2">
                                        {isEditing && (
                                            <div className="text-xs font-medium text-muted-foreground">Título</div>
                                        )}
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                className="text-xl font-semibold bg-muted/20 border-muted/30 h-12"
                                                                placeholder="Título da Tarefa"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <h1 className="text-2xl font-bold text-foreground">
                                                {form.getValues("title") || task.title}
                                            </h1>
                                        )}
                                    </div>

                                    {/* Description Section */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground">Descrição</div>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Escreva algo sobre esta tarefa..."
                                                                className="min-h-[120px] resize-none bg-muted/20 border-muted/30"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <div className="text-sm text-foreground/80 whitespace-pre-wrap min-h-[40px]">
                                                {form.getValues("description") || task.description || (
                                                    <span className="text-muted-foreground/50 italic">Sem descrição</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Epic Context Box */}
                                    {fullTask?.epic?.summary && (
                                        <div className="bg-muted/10 border border-muted/20 rounded-lg p-4 space-y-1">
                                            <div className="text-xs font-medium text-muted-foreground">Contexto do Épico</div>
                                            <p className="text-sm text-muted-foreground/80 italic">"{fullTask.epic.summary}"</p>
                                        </div>
                                    )}

                                    {/* Properties Row: Status | Priority | Epic */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Status */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-muted-foreground">Status</div>
                                            {isEditing ? (
                                                <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <StatusSelect
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                    className="h-9 w-full"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            ) : (
                                                <StatusSelect
                                                    value={form.getValues("status")}
                                                    onValueChange={() => { }}
                                                    className="h-9 w-full pointer-events-none"
                                                />
                                            )}
                                        </div>

                                        {/* Priority */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-muted-foreground">Prioridade</div>
                                            {isEditing ? (
                                                <FormField
                                                    control={form.control}
                                                    name="priority"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <PrioritySelect
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                    className="h-9 w-full"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            ) : (
                                                <PrioritySelect
                                                    value={form.getValues("priority")}
                                                    onValueChange={() => { }}
                                                    className="h-9 w-full pointer-events-none"
                                                />
                                            )}
                                        </div>

                                        {/* Epic */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-muted-foreground">Épico</div>
                                            {isEditing ? (
                                                <FormField
                                                    control={form.control}
                                                    name="epicId"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-9 w-full bg-muted/20 border-muted/30">
                                                                        <SelectValue placeholder="Selecionar épico" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {epics.map((epic) => (
                                                                        <SelectItem key={epic.id} value={epic.id}>
                                                                            {epic.title}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            ) : (
                                                <div className="h-9 flex items-center text-sm text-foreground/80 px-3 bg-muted/10 rounded-md border border-muted/20">
                                                    {epics.find(e => e.id === form.getValues("epicId"))?.title || "—"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Assignee Section */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground">Responsável</div>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="assigneeId"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-10 w-full bg-muted/20 border-muted/30">
                                                                    <SelectValue placeholder="Sem responsável" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {users.map((user) => (
                                                                    <SelectItem key={user.id} value={user.id}>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                                                                                {(user.fullName || "?").charAt(0)}
                                                                            </div>
                                                                            <span>{user.fullName || "Usuário"}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            fullTask?.assignee ? (
                                                <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-muted/20">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
                                                        {(fullTask.assignee.fullName || "?").charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{fullTask.assignee.fullName}</div>
                                                        <div className="text-xs text-muted-foreground">{fullTask.assignee.jobTitle || "Membro"}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-muted-foreground">Nível {fullTask.assignee.level || 1}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground/50 italic py-2">Sem responsável</div>
                                            )
                                        )}
                                    </div>

                                    {/* Labels Section */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground">Etiquetas</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {form.getValues("labels")?.length > 0 ? (
                                                form.getValues("labels").map((labelId) => {
                                                    const label = labels.find(l => l.id === labelId)
                                                    if (!label) return null
                                                    return (
                                                        <Badge
                                                            key={labelId}
                                                            variant="secondary"
                                                            className={cn("border-0 px-2 py-0.5 text-[10px] font-bold rounded-md", getLabelColorClass(label.color))}
                                                        >
                                                            {label.name}
                                                        </Badge>
                                                    )
                                                })
                                            ) : (
                                                <span className="text-sm text-muted-foreground/50 italic">Sem etiquetas</span>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <FormField
                                                control={form.control}
                                                name="labels"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 text-xs gap-2"
                                                                        disabled={!spaceId}
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                        Gerenciar Labels
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[200px] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Procurar label..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>Nenhuma label.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {availableLabels.map((label) => (
                                                                                <CommandItem
                                                                                    value={label.name}
                                                                                    key={label.id}
                                                                                    onSelect={() => {
                                                                                        const current = field.value || []
                                                                                        const isSelected = current.includes(label.id)
                                                                                        if (isSelected) {
                                                                                            form.setValue("labels", current.filter((id) => id !== label.id))
                                                                                        } else {
                                                                                            form.setValue("labels", [...current, label.id])
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            (field.value || []).includes(label.id)
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    <div className="flex items-center gap-2">
                                                                                        <div className={cn("h-3 w-3 rounded-full", getLabelColorClass(label.color))} />
                                                                                        {label.name}
                                                                                    </div>
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    <div className="pt-4 border-t border-muted/20 flex items-center gap-6 text-xs text-muted-foreground/50">
                                        <span>ID: {fullTask?.id || task.id}</span>
                                        <span>Criado: {fullTask?.createdAt ? new Date(fullTask.createdAt).toLocaleDateString('pt-BR') : '--'}</span>
                                    </div>
                                </div>

                                {/* Footer Bar */}
                                <div className="px-6 py-4 flex justify-end items-center gap-3 bg-muted/[0.03] border-t border-muted/20 shrink-0">
                                    {isEditing ? (
                                        <>
                                            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" size="sm">Salvar Alterações</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                                                Fechar
                                            </Button>
                                            <Button type="button" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); }}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
