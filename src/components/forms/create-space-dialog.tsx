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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TERMINOLOGY } from "@/constants/terminology"

const spaceFormSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().optional(),
})

type SpaceFormValues = z.infer<typeof spaceFormSchema>

interface CreateSpaceDialogProps {
    trigger?: React.ReactNode
    onCreated?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateSpaceDialog({ trigger, onCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateSpaceDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const { company, createSpace } = useApp()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    // Safety check for setOpen being undefined in controlled mode if user forgets handler (optional but good)
    const handleOpenChange = (newOpen: boolean) => {
        if (setOpen) {
            setOpen(newOpen)
        }
    }

    const form = useForm<SpaceFormValues>({
        resolver: zodResolver(spaceFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(values: SpaceFormValues) {
        try {
            await createSpace({
                companyId: company.id,
                name: values.name,
                description: values.description,
            })
            form.reset()
            if (setOpen) setOpen(false)
            onCreated?.()
        } catch (error) {
            console.error("Failed to create space", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo {TERMINOLOGY.WORKSPACE}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar {TERMINOLOGY.WORKSPACE}</DialogTitle>
                    <DialogDescription>
                        Crie um novo {TERMINOLOGY.WORKSPACE_LOWER} para organizar seus projetos.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Desenvolvimento" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Descreva o propósito deste ${TERMINOLOGY.WORKSPACE_LOWER}...`}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Opcional. Uma breve descrição do {TERMINOLOGY.WORKSPACE_LOWER}.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen?.(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Criar {TERMINOLOGY.WORKSPACE}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
