"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-context"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Building2,
    Calendar,
    Fingerprint,
    Loader2
} from "lucide-react"

export default function CompanyProfilePage() {
    const { company, isLoaded } = useApp()

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Perfil da Empresa</h1>
                <p className="text-muted-foreground">
                    Visualize e gerencie os dados da sua organização.
                </p>
            </div>

            <Separator />

            <div className="grid gap-6">
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                            Dados Institucionais
                        </CardTitle>
                        <CardDescription>
                            Informações básicas de identificação da empresa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="company-name">Nome da Empresa</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="company-name"
                                        value={company.name}
                                        readOnly
                                        className="pl-10 bg-muted/30 cursor-default focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="company-id">ID da Empresa</Label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="company-id"
                                            value={company.id}
                                            readOnly
                                            className="pl-10 bg-muted/30 cursor-default font-mono text-xs focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="created-at">Data de Fundação</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="created-at"
                                            value={new Date(company.createdAt).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                            readOnly
                                            className="pl-10 bg-muted/30 cursor-default focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
