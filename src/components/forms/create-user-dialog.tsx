"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/app-context"
import { Loader2, Plus } from "lucide-react"
import { UserRole, UserStatus } from "@/types"

const formSchema = z.object({
    email: z.string().email("Email inválido"),
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    jobTitle: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
    globalRole: z.enum(["admin", "member", "viewer"] as [UserRole, ...UserRole[]]),
    status: z.enum(["active", "offline", "away", "busy"] as [UserStatus, ...UserStatus[]]),
    avatarUrl: z.string().optional(),
})

interface CreateUserDialogProps {
    trigger?: React.ReactNode
}

export function CreateUserDialog({ trigger }: CreateUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { createUser } = useApp()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullName: "",
            jobTitle: "",
            globalRole: "member",
            status: "active",
            avatarUrl: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null)
        try {
            await createUser(values)
            setOpen(false)
            form.reset()
        } catch (error) {
            console.error(error)
            setError("Erro ao criar usuário")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Usuário
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Usuário</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para adicionar um novo membro à equipe.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: João Silva" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: joao@empresa.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Desenvolvedor Frontend" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="globalRole"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Função</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="member">Membro</SelectItem>
                                                <SelectItem value="viewer">Visualizador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status Inicial</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Ativo</SelectItem>
                                                <SelectItem value="offline">Offline</SelectItem>
                                                <SelectItem value="busy">Ocupado</SelectItem>
                                                <SelectItem value="away">Ausente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Criar Usuário
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
