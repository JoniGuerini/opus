// ============================================
// Opus - Type Definitions
// ============================================

// Company (Empresa)
export interface Company {
    id: string
    name: string
    slug: string
    logo?: string
    createdAt: Date
    updatedAt: Date
}

// Space (Espaço de Trabalho)
export interface Space {
    id: string
    companyId: string
    name: string
    description?: string
    createdAt: Date
}

// Project (Projeto)
export interface Project {
    id: string
    spaceId: string
    companyId: string
    name: string
    projectKey: string
    description?: string
    status: ProjectStatus
    color?: string
    assigneeId?: string
    createdAt: Date
}

export type ProjectStatus = 'active' | 'archived' | 'completed' | 'on-hold'

// Epic (Épico)
export interface Epic {
    id: string
    projectId: string
    title: string
    name?: string // Alias for title if needed, or deprecate
    summary?: string
    status: EpicStatus
    progress: number
    assigneeId?: string
    createdAt: Date
}

export type EpicStatus = 'todo' | 'in-progress' | 'completed'

// Task (Tarefa)
export interface Task {
    id: string
    epicId: string
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    assigneeId?: string | null
    labels: string[]
    labelEntities?: Label[]
    dueDate?: Date
    createdAt: Date
}

// Label (Etiqueta)
export interface Label {
    id: string
    spaceId: string
    name: string
    color: string // 'RED', 'BLUE', etc. or hex
    createdAt: Date
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// User (Usuário)
export interface User {
    id: string
    companyId: string
    email: string
    fullName: string
    avatarUrl?: string
    jobTitle: string
    globalRole: UserRole
    status: UserStatus
    experience: number
    expNextLevel: number
    level: number
    createdAt: Date
    lastLogin: Date
}

export type UserRole = 'admin' | 'member' | 'viewer'
export type UserStatus = 'active' | 'offline' | 'away' | 'busy'

// Badge (Medalha)
export interface Badge {
    id: string
    name: string
    icon: string
    description: string
}

// UserBadge (Medalha do Usuário)
export interface UserBadge {
    userId: string
    badgeId: string
    earnedAt: Date
}

// ============================================
// Utility Types
// ============================================

// For creating new items (without id, createdAt, updatedAt)
export type CreateSpace = Omit<Space, 'id' | 'createdAt' | 'updatedAt'>
export type CreateProject = Omit<Project, 'id' | 'createdAt'>
export type CreateEpic = Omit<Epic, 'id' | 'createdAt'>
export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'labelEntities'>
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'experience' | 'expNextLevel' | 'level'>
export type CreateLabel = Omit<Label, 'id' | 'createdAt'>

// Status/Priority options for UI
export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'on-hold', label: 'Em Espera' },
    { value: 'completed', label: 'Concluído' },
    { value: 'archived', label: 'Arquivado' },
]

export const EPIC_STATUS_OPTIONS: { label: string; value: EpicStatus }[] = [
    { label: "A Fazer", value: "todo" },
    { label: "Em Progresso", value: "in-progress" },
    { label: "Concluído", value: "completed" },
]

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'A fazer' },
    { value: 'in-progress', label: 'Em progresso' },
    { value: 'done', label: 'Concluído' },
]

export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Baixa', color: 'bg-slate-500' },
    { value: 'medium', label: 'Média', color: 'bg-blue-500' },
    { value: 'high', label: 'Alta', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500' },
]

export interface DashboardData {
    totalSpaces: number
    totalProjects: number
    totalEpics: number
    totalTasks: number
    taskStatusDistribution: {
        status: string
        count: number
    }[]
    recentActivities: {
        id: string
        type: string
        name: string
        timestamp: string
        meta: string
    }[]
    availableProjects: {
        id: string
        name: string
    }[]
    selectedProjectId: string
}
