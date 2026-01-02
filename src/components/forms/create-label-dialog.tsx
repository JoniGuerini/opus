"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useApp } from "@/contexts/app-context"
import { getLabelColorClass } from "@/lib/utils-colors"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Tag } from "lucide-react"
import { useState } from "react"
import { Label } from "@/types"

const labelFormSchema = z.object({
    name: z.string().min(1, {
        message: "O nome é obrigatório.",
    }),
    color: z.string().min(1, {
        message: "A cor é obrigatória.",
    }),
})

type LabelFormValues = z.infer<typeof labelFormSchema>

interface CreateLabelDialogProps {
    spaceId: string
    trigger?: React.ReactNode
    onCreated?: (label: Label) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const COLORS = [
    { label: "Vermelho", value: "RED" },
    { label: "Azul", value: "BLUE" },
    { label: "Verde", value: "GREEN" },
    { label: "Amarelo", value: "YELLOW" },
    { label: "Laranja", value: "ORANGE" },
    { label: "Roxo", value: "PURPLE" },
    { label: "Rosa", value: "PINK" },
    { label: "Cinza", value: "GRAY" },
]

export function CreateLabelDialog({ spaceId, trigger, onCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateLabelDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const { createLabel } = useApp()

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const form = useForm<LabelFormValues>({
        resolver: zodResolver(labelFormSchema),
        defaultValues: {
            name: "",
            color: "GRAY",
        },
    })

    async function onSubmit(values: LabelFormValues) {
        try {
            const newLabel = await createLabel({
                spaceId,
                name: values.name,
                color: values.color,
            })
            form.reset()
            if (setOpen) setOpen(false)
            onCreated?.(newLabel)
        } catch (error) {
            console.error("Failed to create label", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Tag className="mr-2 h-4 w-4" />
                        Nova Label
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Label</DialogTitle>
                    <DialogDescription>
                        Crie uma nova label para organizar as tarefas deste espaço.
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
                                        <Input placeholder="Ex: Backend, Frontend, Bug..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma cor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {COLORS.map((color) => (
                                                <SelectItem key={color.value} value={color.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-3 w-3 rounded-full ${getLabelColorClass(color.value)}`} />
                                                        {color.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen?.(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Criar Label</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
