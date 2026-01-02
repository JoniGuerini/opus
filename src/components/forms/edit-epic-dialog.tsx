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
import { useState, useEffect } from "react"
import { Epic } from "@/types"

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

interface EditEpicDialogProps {
    epic: Epic
    trigger?: React.ReactNode
    onUpdated?: () => void
}

export function EditEpicDialog({ epic, trigger, onUpdated }: EditEpicDialogProps) {
    const [open, setOpen] = useState(false)
    const { projects, updateEpic } = useApp()

    const form = useForm<EpicFormValues>({
        resolver: zodResolver(epicFormSchema),
        defaultValues: {
            title: epic.title,
            summary: epic.summary || "",
            projectId: epic.projectId,
        },
    })

    // Reset form when epic prop changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                title: epic.title,
                summary: epic.summary || "",
                projectId: epic.projectId,
            })
        }
    }, [epic, open, form])

    async function onSubmit(values: EpicFormValues) {
        try {
            await updateEpic(epic.id, {
                projectId: values.projectId,
                title: values.title,
                summary: values.summary,
            })
            setOpen(false)
            onUpdated?.()
        } catch (error) {
            console.error("Failed to update epic", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm">Editar</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Épico</DialogTitle>
                    <DialogDescription>
                        Altere as informações do épico.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id={`edit-epic-form-${epic.id}`}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={(e) => form.handleSubmit(onSubmit)(e)}
                            >
                                Salvar Alterações
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
