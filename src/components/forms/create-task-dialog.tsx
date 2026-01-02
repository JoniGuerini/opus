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

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Plus, Check, ChevronsUpDown, Tag } from "lucide-react"
import { useState, useEffect } from "react"
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
    status: z.string().default("todo"),
    priority: z.string().default("medium"),
    assigneeId: z.string().optional(),

    labels: z.array(z.string()).default([]),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface CreateTaskDialogProps {
    epicId?: string
    trigger?: React.ReactNode
    onCreated?: () => void
}

export function CreateTaskDialog({ epicId, trigger, onCreated }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const { epics, users, createTask, projects, labels } = useApp()
    const [spaceId, setSpaceId] = useState<string | undefined>()

    // Debug epics
    useEffect(() => {
        if (open) {
            console.log("[CreateTaskDialog] Available Epics:", epics)
            console.log("[CreateTaskDialog] Prop epicId:", epicId)
        }
    }, [open, epics, epicId])

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            epicId: epicId || "",
            status: "todo",
            priority: "medium",
            assigneeId: "",

            labels: [],
        },
    })

    // Watch logic for Space ID
    const selectedEpicId = form.watch("epicId")
    useEffect(() => {
        if (selectedEpicId) {
            const epic = epics.find(e => e.id === selectedEpicId)
            if (epic) {
                const project = projects.find(p => p.id === epic.projectId)
                if (project) {
                    setSpaceId(project.spaceId)
                }
            }
        } else {
            setSpaceId(undefined)
        }
    }, [selectedEpicId, epics, projects])

    const availableLabels = spaceId ? labels.filter(l => l.spaceId === spaceId) : []

    const getColorClass = (colorName: string) => {
        const map: Record<string, string> = {
            'RED': 'bg-red-500',
            'BLUE': 'bg-blue-500',
            'GREEN': 'bg-green-500',
            'YELLOW': 'bg-yellow-500',
            'ORANGE': 'bg-orange-500',
            'PURPLE': 'bg-purple-500',
            'PINK': 'bg-pink-500',
            'GRAY': 'bg-gray-500',
        }
        return map[colorName] || 'bg-gray-500'
    }



    function onSubmit(values: TaskFormValues) {
        // labels is already string[]
        const labels = values.labels || []

        // Reverting to undefined: omit the key entirely if empty. 
        // Backend seems to reject `null`, and `undefined` will be strip by JSON.stringify.
        const assigneeId = values.assigneeId && values.assigneeId.trim() !== ""
            ? values.assigneeId
            : undefined

        createTask({
            epicId: values.epicId,
            title: values.title,
            description: values.description,
            status: values.status as any,
            priority: values.priority as any,
            assigneeId: assigneeId,
            labels: labels,
        })
        form.reset()
        setOpen(false)
        onCreated?.()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Tarefa
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Criar Tarefa</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova tarefa ao épico.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control as any}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Implementar login com Google" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control as any}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva a tarefa em detalhes..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!epicId && (
                            <FormField
                                control={form.control}
                                name="epicId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Épico</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um épico" />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <StatusSelect
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="h-10 w-full border border-input bg-background px-3 py-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prioridade</FormLabel>
                                        <FormControl>
                                            <PrioritySelect
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="h-10 w-full border border-input bg-background px-3 py-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="assigneeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsável</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um responsável" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Opcional. Quem será responsável por esta tarefa.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="labels"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Labels</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between h-auto min-h-10",
                                                        !field.value?.length && "text-muted-foreground"
                                                    )}
                                                    disabled={!spaceId}
                                                >
                                                    {field.value?.length > 0 ? (
                                                        <div className="flex gap-1 flex-wrap py-1">
                                                            {field.value.map((labelId) => {
                                                                const label = labels.find(l => l.id === labelId)
                                                                // Fallback if label not found but ID is there
                                                                if (!label) return null
                                                                return (
                                                                    <Badge
                                                                        key={labelId}
                                                                        variant="secondary"
                                                                        className={cn("mr-1 text-white border-0", getColorClass(label.color))}
                                                                    >
                                                                        {label.name}
                                                                    </Badge>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        spaceId ? "Selecione labels" : "Selecione um épico primeiro"
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Procurar label..." />
                                                <CommandList>
                                                    <CommandEmpty>Nenhuma label encontrada.</CommandEmpty>
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
                                                                    <div className={cn("h-3 w-3 rounded-full", getColorClass(label.color))} />
                                                                    {label.name}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>

                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Criar Tarefa</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
