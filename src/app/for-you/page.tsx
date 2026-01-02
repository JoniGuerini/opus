"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    CircleDashed,
    Layers,
    Layout,
    CheckSquare,
    Calendar as CalendarIcon,
    ChevronRight,
    Search,
    Plus
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TASK_STATUS_OPTIONS, EPIC_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CreateProjectDialog, CreateEpicDialog, CreateTaskDialog } from "@/components/forms"

export default function ForYouPage() {
    const { currentUser, tasks, epics, projects, isLoaded } = useApp()
    const [searchQuery, setSearchQuery] = React.useState("")

    if (!isLoaded) return null

    // Filter items assigned to current user
    const myTasks = tasks.filter(t => t.assigneeId === currentUser.id &&
        (t.title.toLowerCase().includes(searchQuery.toLowerCase())))

    const myEpics = epics.filter(e => e.assigneeId === currentUser.id &&
        (e.title.toLowerCase().includes(searchQuery.toLowerCase())))

    const myProjects = projects.filter(p => p.assigneeId === currentUser.id &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase())))

    const getStatusIcon = (status: string, type: 'task' | 'epic' | 'project') => {
        if (type === 'task') {
            switch (status) {
                case 'done': return <CheckCircle2 className="h-4 w-4 text-green-500" />
                case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />
                case 'review': return <AlertCircle className="h-4 w-4 text-orange-500" />
                default: return <CircleDashed className="h-4 w-4 text-muted-foreground" />
            }
        }
        return <Clock className="h-4 w-4 text-primary" />
    }

    const getPriorityBadge = (priority: string) => {
        const option = TASK_PRIORITY_OPTIONS.find(p => p.value === priority)
        return (
            <Badge variant="outline" className={`${option?.color.replace('bg-', 'text-')} border-current text-[10px] h-5`}>
                {option?.label}
            </Badge>
        )
    }

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            <Tabs defaultValue="tasks" className="w-full flex-1 flex flex-col">
                <div className="flex flex-col gap-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="tasks" className="gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Tarefas
                            <Badge className="ml-1 px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center bg-[#4B4B4B] hover:bg-[#5B5B5B] text-white border-none">
                                {myTasks.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="epics" className="gap-2">
                            <Layers className="h-4 w-4" />
                            Épicos
                            <Badge className="ml-1 px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center bg-[#4B4B4B] hover:bg-[#5B5B5B] text-white border-none">
                                {myEpics.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="gap-2">
                            <Layout className="h-4 w-4" />
                            Projetos
                            <Badge className="ml-1 px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center bg-[#4B4B4B] hover:bg-[#5B5B5B] text-white border-none">
                                {myProjects.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex justify-start">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <TabsContent value="tasks" className="flex-1 mt-6">
                    <div className="grid gap-4">
                        {myTasks.length > 0 ? (
                            myTasks.map(task => (
                                <Card key={task.id} className="group hover:border-primary/50 transition-colors">
                                    <Link href={(() => {
                                        const epic = epics.find(e => e.id === task.epicId)
                                        const project = epic ? projects.find(p => p.id === epic.projectId) : undefined
                                        return project ? `/spaces/${project.spaceId}/projects/${project.id}/epics/${epic?.id}` : '#'
                                    })()} className="block">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                {getStatusIcon(task.status, 'task')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold truncate">{task.title}</h3>
                                                    {getPriorityBadge(task.priority)}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate italic">
                                                    {task.description || "Sem descrição"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {task.dueDate && (
                                                    <div className="hidden md:flex flex-col items-end">
                                                        <span className="text-[10px] uppercase text-muted-foreground font-medium">Prazo</span>
                                                        <span className="text-sm font-medium">
                                                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    </div>
                                                )}
                                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <Empty className="border-2 border-dashed rounded-xl">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <CheckSquare className="h-6 w-6" />
                                    </EmptyMedia>
                                    <EmptyTitle>Nenhuma tarefa encontrada</EmptyTitle>
                                    <EmptyDescription>
                                        Você não possui tarefas atribuídas no momento ou a busca não retornou resultados.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <CreateTaskDialog
                                        trigger={
                                            <Button variant="outline">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Criar Tarefa
                                            </Button>
                                        }
                                    />
                                </EmptyContent>
                            </Empty>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="epics" className="flex-1 mt-6">
                    <div className="grid gap-4">
                        {myEpics.length > 0 ? (
                            myEpics.map(epic => (
                                <Card key={epic.id} className="group hover:border-primary/50 transition-colors">
                                    <Link href={(() => {
                                        const project = projects.find(p => p.id === epic.projectId)
                                        return project ? `/spaces/${project.spaceId}/projects/${project.id}/epics/${epic.id}` : '#'
                                    })()} className="block">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <Layers className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{epic.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="secondary" className="h-5 text-[10px]">
                                                        {EPIC_STATUS_OPTIONS.find(o => o.value === epic.status)?.label}
                                                    </Badge>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500"
                                                                style={{ width: `${epic.progress}%` }}
                                                            />
                                                        </div>
                                                        <span>{epic.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <Empty className="border-2 border-dashed rounded-xl">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Layers className="h-6 w-6" />
                                    </EmptyMedia>
                                    <EmptyTitle>Nenhum épico encontrado</EmptyTitle>
                                    <EmptyDescription>
                                        Fique tranquilo, não há épicos sob sua gestão no momento.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <CreateEpicDialog
                                        trigger={
                                            <Button variant="outline">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Criar Épico
                                            </Button>
                                        }
                                    />
                                </EmptyContent>
                            </Empty>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="flex-1 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myProjects.length > 0 ? (
                            myProjects.map(project => (
                                <Card key={project.id} className="group hover:border-primary/50 transition-all hover:shadow-md">
                                    <Link href={`/spaces/${project.spaceId}/projects/${project.id}`} className="flex flex-col h-full">
                                        <CardHeader className="p-5 pb-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden`} style={{ backgroundColor: project.color || '#6366f1' }}>
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <Badge variant="outline" className="capitalize">
                                                    {PROJECT_STATUS_OPTIONS.find(o => o.value === project.status)?.label}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base mt-4 line-clamp-1">{project.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5 pt-0 mt-auto">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>Iniciado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <Empty className="border-2 border-dashed rounded-xl w-full">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <Layout className="h-6 w-6" />
                                        </EmptyMedia>
                                        <EmptyTitle>Nenhum projeto encontrado</EmptyTitle>
                                        <EmptyDescription>
                                            Você não é o responsável por nenhum projeto ativo.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <CreateProjectDialog
                                            trigger={
                                                <Button variant="outline">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Criar Projeto
                                                </Button>
                                            }
                                        />
                                    </EmptyContent>
                                </Empty>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
