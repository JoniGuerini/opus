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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { TERMINOLOGY } from "@/constants/terminology"
import { Project } from "@/types"

const projectFormSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    projectKey: z.string().min(2, {
        message: "O código deve ter pelo menos 2 caracteres.",
    }).max(10, {
        message: "O código deve ter no máximo 10 caracteres.",
    }).transform(v => v.toUpperCase()),
    description: z.string().optional(),
    spaceId: z.string().min(1, {
        message: `Selecione um ${TERMINOLOGY.WORKSPACE_LOWER}.`,
    }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface EditProjectDialogProps {
    project: Project
    trigger?: React.ReactNode
    onUpdated?: () => void
}

export function EditProjectDialog({ project, trigger, onUpdated }: EditProjectDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { spaces, updateProject } = useApp()

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: project.name,
            projectKey: project.projectKey,
            description: project.description || "",
            spaceId: project.spaceId,
        },
    })

    // Reset form when project prop changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                name: project.name,
                projectKey: project.projectKey,
                description: project.description || "",
                spaceId: project.spaceId,
            })
        }
    }, [project, open, form])

    async function onSubmit(values: ProjectFormValues) {
        setError(null)
        try {
            await updateProject(project.id, {
                spaceId: values.spaceId,
                name: values.name,
                projectKey: values.projectKey,
                description: values.description,
            })
            setOpen(false)
            onUpdated?.()
        } catch (err: any) {
            setError(err.message)
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
                    <DialogTitle>Editar Projeto</DialogTitle>
                    <DialogDescription>
                        Altere as informações do projeto.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id={`edit-project-form-${project.id}`}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Projeto</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Opus SaaS" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="projectKey"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CORE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva o propósito deste projeto..."
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
                            name="spaceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{TERMINOLOGY.WORKSPACE}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Selecione um ${TERMINOLOGY.WORKSPACE_LOWER}`} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {spaces.map((ws) => (
                                                <SelectItem key={ws.id} value={ws.id}>
                                                    {ws.name}
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
