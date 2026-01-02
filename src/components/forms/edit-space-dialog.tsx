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
import { useState, useEffect } from "react"
import { TERMINOLOGY } from "@/constants/terminology"
import { Space } from "@/types"

const spaceFormSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().optional(),
})

type SpaceFormValues = z.infer<typeof spaceFormSchema>

interface EditSpaceDialogProps {
    space: Space
    trigger?: React.ReactNode
    onUpdated?: () => void
}

export function EditSpaceDialog({ space, trigger, onUpdated }: EditSpaceDialogProps) {
    const [open, setOpen] = useState(false)
    const { updateSpace } = useApp()

    const form = useForm<SpaceFormValues>({
        resolver: zodResolver(spaceFormSchema) as any,
        defaultValues: {
            name: space.name,
            description: space.description || "",
        },
    })

    // Reset form when space prop changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                name: space.name,
                description: space.description || "",
            })
        }
    }, [space, open, form])

    async function onSubmit(values: SpaceFormValues) {
        try {
            await updateSpace(space.id, {
                name: values.name,
                description: values.description,
            })
            setOpen(false)
            onUpdated?.()
        } catch (error) {
            console.error("Error calling updateSpace:", error)
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
                    <DialogTitle>Editar {TERMINOLOGY.WORKSPACE}</DialogTitle>
                    <DialogDescription>
                        Altere as informações do seu {TERMINOLOGY.WORKSPACE_LOWER}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
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
