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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { EPIC_STATUS_OPTIONS } from "@/types"

const epicFormSchema = z.object({
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    summary: z.string().optional(),
    projectId: z.string().min(1, {
        message: "Selecione um projeto.",
    }),
})

type EpicFormValues = z.infer<typeof epicFormSchema>

interface CreateEpicDialogProps {
    projectId?: string
    trigger?: React.ReactNode
    onCreated?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateEpicDialog({ projectId, trigger, onCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateEpicDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const { projects, createEpic } = useApp()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const form = useForm<EpicFormValues>({
        resolver: zodResolver(epicFormSchema),
        defaultValues: {
            title: "",
            summary: "",
            projectId: projectId || "",
        },
    })

    async function onSubmit(values: EpicFormValues) {
        try {
            await createEpic({
                projectId: values.projectId,
                title: values.title,
                summary: values.summary,
                status: 'todo',
                progress: 0,
            })
            form.reset()
            setOpen?.(false)
            onCreated?.()
        } catch (error) {
            console.error("Failed to create epic", error)
            // Error handling could be improved with local state
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Épico
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Épico</DialogTitle>
                    <DialogDescription>
                        Crie um novo épico para agrupar tarefas relacionadas.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Sistema de Autenticação" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resumo</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o propósito deste épico..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!projectId && (
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Projeto</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um projeto" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projects.map((project) => (
                                                    <SelectItem key={project.id} value={project.id}>
                                                        {project.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen?.(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Criar Épico</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
