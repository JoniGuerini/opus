"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-context"
import { BadgesList } from "@/components/badges-list"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    User as UserIcon,
    Mail,
    Shield,
    Calendar,
    Camera,
    Loader2,
    Award,
    Briefcase,
    Activity,
    LogIn,
    Fingerprint,
    Building2,
    CheckCircle2,
    Clock,
    MinusCircle,
    XCircle
} from "lucide-react"

export default function ProfilePage() {
    const { currentUser, isLoaded, badges, userBadges } = useApp()
    const [isSaving, setIsSaving] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [fullName, setFullName] = React.useState("")
    const [jobTitle, setJobTitle] = React.useState("")

    React.useEffect(() => {
        if (currentUser) {
            setFullName(currentUser.fullName)
            setJobTitle(currentUser.jobTitle)
        }
    }, [currentUser])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const handleSave = () => {
        setIsSaving(true)
        // Simulate save
        setTimeout(() => {
            setIsSaving(false)
            setIsEditing(false)
        }, 800)
    }

    const handleCancel = () => {
        setFullName(currentUser.fullName)
        setJobTitle(currentUser.jobTitle)
        setIsEditing(false)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            case 'away': return <Clock className="h-3.5 w-3.5 text-amber-500" />
            case 'busy': return <MinusCircle className="h-3.5 w-3.5 text-red-500" />
            default: return <XCircle className="h-3.5 w-3.5 text-slate-400" />
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Ativo'
            case 'away': return 'Ausente'
            case 'busy': return 'Ocupado'
            case 'offline': return 'Offline'
            default: return status
        }
    }

    const expPercentage = Math.min(100, Math.floor((currentUser.experience / currentUser.expNextLevel) * 100))

    return (
        <div className="container max-w-3xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative group">
                    <Avatar className="h-40 w-40 border-4 border-background shadow-xl ring-1 ring-border">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-4xl font-bold">
                            {currentUser.fullName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-primary border-4 border-background flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                        {currentUser.level}
                    </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left pt-4">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{currentUser.fullName}</h1>
                            <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-0.5 h-6">
                                {getStatusIcon(currentUser.status)}
                                {getStatusLabel(currentUser.status)}
                            </Badge>
                        </div>
                        <p className="text-xl text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                            <Briefcase className="h-4 w-4" />
                            {currentUser.jobTitle}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                            <Shield className="h-3.5 w-3.5" />
                            <span className="capitalize">{currentUser.globalRole}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Entrou em {new Date(currentUser.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="mt-2"
                        >
                            <UserIcon className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Button>
                    ) : (
                        <div className="flex gap-2 justify-center md:justify-start">
                            <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Salvando..." : "Salvar"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                                Cancelar
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Stats & Leveling */}
                <div className="space-y-6">
                    <Card className="border shadow-sm overflow-hidden">
                        <div className="h-2 bg-primary/20">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${expPercentage}%` }}
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                Nível e Experiência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold">{currentUser.level}</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Nível Atual</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {currentUser.experience} / {currentUser.expNextLevel} XP
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                                        {expPercentage}% para o nível {currentUser.level + 1}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Atividade Recente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <LogIn className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">Último Acesso</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(currentUser.lastLogin).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Badges & Account Details */}
                <div className="lg:col-span-2 space-y-6">
                    <BadgesList
                        badges={badges}
                        userBadges={userBadges}
                        userId={currentUser.id}
                    />

                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Detalhes da Conta</CardTitle>
                            <CardDescription>Informações fundamentais e identificadores do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Nome Completo</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled={!isEditing}
                                            className="pl-10 h-10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Endereço de E-mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            value={currentUser.email}
                                            disabled
                                            className="pl-10 h-10 bg-muted/50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jobTitle">Cargo / Função</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="jobTitle"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            disabled={!isEditing}
                                            className="pl-10 h-10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="globalRole">Permissão Global</Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="globalRole"
                                            value={currentUser.globalRole}
                                            disabled
                                            className="pl-10 h-10 bg-muted/50 cursor-not-allowed capitalize"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="userId" className="text-xs text-muted-foreground">ID do Usuário</Label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground/50" />
                                        <Input
                                            id="userId"
                                            value={currentUser.id}
                                            disabled
                                            className="pl-9 h-8 bg-muted/20 text-[10px] font-mono border-dashed cursor-default"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="companyId" className="text-xs text-muted-foreground">ID da Empresa</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground/50" />
                                        <Input
                                            id="companyId"
                                            value={currentUser.companyId}
                                            disabled
                                            className="pl-9 h-8 bg-muted/20 text-[10px] font-mono border-dashed cursor-default"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
