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
import { Plus } from "lucide-react"
import { useState } from "react"
import { PROJECT_STATUS_OPTIONS } from "@/types"
import { TERMINOLOGY } from "@/constants/terminology"

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

interface CreateProjectDialogProps {
    spaceId?: string
    trigger?: React.ReactNode
    onCreated?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateProjectDialog({ spaceId, trigger, onCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateProjectDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { company, spaces, createProject } = useApp()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: "",
            projectKey: "",
            description: "",
            spaceId: spaceId || "",
        },
    })

    async function onSubmit(values: ProjectFormValues) {
        setError(null)
        try {
            await createProject({
                spaceId: values.spaceId,
                companyId: company.id,
                name: values.name,
                projectKey: values.projectKey,
                description: values.description,
                status: 'active',
                color: '#6366f1',
            })
            form.reset()
            setOpen?.(false)
            onCreated?.()
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Projeto
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Projeto</DialogTitle>
                    <DialogDescription>
                        Crie um novo projeto dentro de um {TERMINOLOGY.WORKSPACE_LOWER}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {!spaceId && (
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
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen?.(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Criar Projeto</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
