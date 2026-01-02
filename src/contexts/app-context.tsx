"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
    Company,
    Space,
    Project,
    Epic,
    Task,
    User,
    Badge,
    UserBadge,
    CreateSpace,
    CreateProject,
    CreateEpic,
    CreateTask,
    CreateUser,
    Label,
    CreateLabel,
} from "@/types"

// ============================================
// Mock Data
// ============================================

const MOCK_COMPANIES: Company[] = [
    {
        id: "cp00909ucQ",
        name: "Opus Software",
        slug: "opus-software",
        logo: "GalleryVerticalEnd",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "cp00909ucR",
        name: "Acme Corp.",
        slug: "acme-corp",
        logo: "AudioWaveform",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
    },
    {
        id: "cp00909ucS",
        name: "Evil Corp.",
        slug: "evil-corp",
        logo: "Command",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-01"),
    }
]

// Mock users removed to enforce API source

// Mock workspaces removed to enforce API source

// Mock projects, epics, and tasks removed to enforce API source

// ============================================
// Medalhas (Badges) - Constantes
// ============================================

const ALL_BADGES: Badge[] = [
    {
        id: "first-task",
        name: "Primeira de Muitas",
        icon: "🎯",
        description: "Concluiu sua primeira tarefa no Opus."
    },
    {
        id: "task-master",
        name: "Mestre das Tarefas",
        icon: "🏆",
        description: "Concluiu um total de 10 tarefas."
    },
    {
        id: "epic-conqueror",
        name: "Conquistador de Épicos",
        icon: "⚔️",
        description: "Completou 20 tarefas dentro do mesmo épico."
    }
]

// ============================================
// Context Types
// ============================================

interface AppContextType {
    // Data
    company: Company
    companies: Company[]
    currentUser: User
    users: User[]
    spaces: Space[]
    projects: Project[]
    epics: Epic[]
    tasks: Task[]
    labels: Label[]
    badges: Badge[]
    userBadges: UserBadge[]
    isLoaded: boolean

    // Actions
    setSelectedCompanyId: (id: string) => void

    // Space CRUD
    createSpace: (data: CreateSpace) => Promise<Space>
    updateSpace: (id: string, data: Partial<Space>) => Promise<void>
    deleteSpace: (id: string) => void

    // Project CRUD
    createProject: (data: CreateProject) => Promise<Project>
    updateProject: (id: string, data: Partial<Project>) => Promise<void>
    deleteProject: (id: string) => void

    // Epic CRUD
    createEpic: (data: CreateEpic) => Promise<Epic>
    updateEpic: (id: string, data: Partial<Epic>) => Promise<void>
    deleteEpic: (id: string) => void

    // Task CRUD
    createTask: (data: CreateTask) => Promise<Task>
    updateTask: (id: string, data: Partial<Task>) => Promise<void>
    deleteTask: (id: string) => Promise<void>

    // User CRUD
    // User CRUD
    createUser: (data: Omit<CreateUser, 'companyId'>) => Promise<User>
    updateUser: (id: string, data: Partial<User>) => Promise<void>
    deleteUser: (id: string) => void

    // Label CRUD
    createLabel: (data: CreateLabel) => Promise<Label>

    // Helpers
    getSpaceProjects: (spaceId: string) => Project[]
    getProjectEpics: (projectId: string) => Epic[]
    getEpicTasks: (epicId: string) => Task[]
    getUserById: (userId: string) => User | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>(MOCK_COMPANIES[0].id)
    const [spaces, setSpaces] = useState<Space[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [epics, setEpics] = useState<Epic[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [labels, setLabels] = useState<Label[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [userBadges, setUserBadges] = useState<UserBadge[]>([])

    // Local Storage Persistence
    const [isLoaded, setIsLoaded] = useState(false)

    // ... imports

    const API_URL = "/api"

    // ... mock data ...

    // ... inside AppProvider ...

    // Derived
    const company = MOCK_COMPANIES.find(c => c.id === selectedCompanyId) || MOCK_COMPANIES[0]

    // Initial Load
    React.useEffect(() => {
        // Fetch Spaces from API
        // Fetch Spaces and Projects from API
        const fetchData = async () => {
            try {
                // Fetch Spaces
                const spacesResponse = await fetch(`${API_URL}/spaces/${company.id}`)
                let parsedData: any[] = []
                if (spacesResponse.ok) {
                    const data = await spacesResponse.json()
                    parsedData = data.map((ws: any) => ({
                        id: ws.id || ws._id,
                        companyId: ws.companyId || ws.company_id,
                        name: ws.name,
                        description: ws.description,
                        createdAt: new Date(ws.createdAt || ws.created_at || Date.now())
                    }))

                    // Deduplicate spaces
                    const uniqueSpaces = Array.from(new Map(parsedData.map((s: any) => [s.id, s])).values())
                    setSpaces(uniqueSpaces)
                    parsedData = uniqueSpaces // Update parsedData to be unique for subsequent use
                } else {
                    console.error("[AppContext] Failed to fetch spaces", await spacesResponse.text())
                }

                // Fetch Labels (Assuming /api/labels/:spaceId or similar. For now we will just mock or leave empty until user clarifies API, 
                // but actually we can try to fetch them if we have an endpoint. 
                // Let's assume we can fetch them per space or for company using spaces.)
                // Given the instructions, I'll implement createLabel fully. Reading labels:
                // I'll try to fetch labels for all spaces.
                if (spacesResponse.ok) {
                    // Use parsedData which we already have, mapping it back or just reusing logic if possible.
                    // Actually parsedData has correct IDs.
                    const spacesData = parsedData
                    const allLabels: Label[] = []
                    await Promise.all(spacesData.map(async (space: any) => {
                        try {
                            const res = await fetch(`${API_URL}/labels/${space.id || space._id}`)
                            if (res.ok) {
                                const lbs = await res.json()
                                allLabels.push(...lbs.map((l: any) => ({
                                    id: l.id || l._id,
                                    spaceId: l.spaceId || l.space_id,
                                    name: l.name,
                                    color: l.color,
                                    createdAt: new Date(l.createdAt || l.created_at || Date.now())
                                })))
                            }
                        } catch (e) { /* ignore */ }
                    }))
                    // Dedup
                    const uniqueLabels = Array.from(new Map(allLabels.map(l => [l.id, l])).values())
                    setLabels(uniqueLabels)
                }

                let currentProjects: Project[] = []
                // Fetch Projects
                const projectsResponse = await fetch(`${API_URL}/projects/${company.id}`)
                if (projectsResponse.ok) {
                    const data = await projectsResponse.json()
                    console.log("[AppContext] Fetched projects:", data)
                    const parsedData = data.map((p: any) => ({
                        id: p.id || p._id,
                        name: p.name,
                        projectKey: p.projectKey || p.project_key || "KEY",
                        description: p.description,
                        spaceId: p.spaceId || p.space_id,
                        companyId: p.companyId || p.company_id,
                        status: p.status || 'active',
                        color: p.color || '#6366f1',
                        assigneeId: p.assigneeId || p.assignee_id,
                        createdAt: new Date(p.createdAt || p.created_at || Date.now())
                    }))

                    // Deduplicate projects
                    const uniqueProjects = Array.from(new Map(parsedData.map((p: any) => [p.id, p])).values()) as Project[]
                    setProjects(uniqueProjects)
                    currentProjects = uniqueProjects
                } else {
                    console.error("[AppContext] Failed to fetch projects", await projectsResponse.text())
                }

                // Fetch Epics for all projects
                if (currentProjects.length > 0) {
                    const epicsPromises = currentProjects.map(async (project) => {
                        try {
                            const response = await fetch(`${API_URL}/epics/${project.id}`)
                            if (response.ok) {
                                return await response.json()
                            }
                            return []
                        } catch (e) {
                            console.error(`[AppContext] Failed to fetch epics for project ${project.id}`, e)
                            return []
                        }
                    })

                    const epicsArrays = await Promise.all(epicsPromises)
                    // Flatten arrays and remove duplicates
                    const allEpicsRaw = epicsArrays.flat().map((epic: any) => ({
                        id: epic.id || epic._id,
                        title: epic.title || epic.name,
                        summary: epic.summary || epic.description,
                        projectId: epic.projectId || epic.project_id,
                        status: epic.status || 'todo',
                        progress: epic.progress || 0,
                        assigneeId: epic.assigneeId || epic.assignee_id,
                        createdAt: new Date(epic.createdAt || epic.created_at || Date.now())
                    }))

                    // Deduplicate Epics
                    const uniqueEpics = Array.from(new Map(allEpicsRaw.filter(e => e.id).map(e => [e.id, e])).values()) as Epic[]
                    console.log("[AppContext] Fetched Epics:", uniqueEpics)
                    setEpics(uniqueEpics)

                    // Fetch Tasks for all Epics
                    if (uniqueEpics.length > 0) {
                        const tasksPromises = uniqueEpics.map(async (epic) => {
                            try {
                                const response = await fetch(`${API_URL}/tasks/epic/${epic.id}`)
                                if (response.ok) {
                                    return await response.json()
                                }
                                return []
                            } catch (e) {
                                console.error(`[AppContext] Failed to fetch tasks for epic ${epic.id}`, e)
                                return []
                            }
                        })

                        const tasksArrays = await Promise.all(tasksPromises)
                        const allTasksRaw = tasksArrays.flat().map((task: any) => ({
                            id: task.id || task._id,
                            title: task.title || task.name,
                            description: task.description,
                            status: (task.status === 'doing' ? 'in-progress' : task.status) || 'todo',
                            priority: (task.priority?.toLowerCase() as any) || 'medium',
                            epicId: task.epicId || task.epic_id,
                            assigneeId: task.assigneeId || task.assignee?.id || null,
                            labelEntities: task.labelEntities,
                            labels: task.labelEntities ? task.labelEntities.map((l: any) => l.name) : (task.labels || []),
                            createdAt: new Date(task.createdAt || task.created_at || Date.now())
                        }))

                        // Deduplicate Tasks
                        const uniqueTasks = Array.from(new Map(allTasksRaw.filter(t => t.id).map(t => [t.id, t])).values()) as Task[]
                        console.log("[AppContext] Fetched Tasks:", uniqueTasks)
                        setTasks(uniqueTasks)
                    }
                }

                // Fetch Users
                const usersResponse = await fetch(`${API_URL}/users/${company.id}`)
                if (usersResponse.ok) {
                    const data = await usersResponse.json()

                    if (data.length > 0) {

                    }

                    const parsedData = data.map((u: any) => ({
                        id: u.id || u._id || u.email,
                        companyId: u.companyId || u.company_id,
                        email: u.email,
                        fullName: u.fullName || u.full_name,
                        avatarUrl: u.avatarUrl || u.avatar_url,
                        jobTitle: u.jobTitle || u.job_title,
                        globalRole: u.globalRole || u.global_role,
                        status: u.status,
                        experience: u.experience || 0,
                        expNextLevel: u.expNextLevel || u.exp_next_level || 100,
                        level: u.level || 1,
                        createdAt: new Date(u.createdAt || u.created_at || Date.now()),
                        lastLogin: u.lastLogin || u.last_login ? new Date(u.lastLogin || u.last_login) : new Date()
                    }))

                    // Remove duplicates just in case (using the fallback ID)
                    const uniqueUsers = Array.from(new Map(parsedData.map((u: any) => [u.id, u])).values())
                    console.log("[AppContext] Fetched Users:", uniqueUsers.map((u: any) => ({ id: u.id, name: u.fullName })))
                    setUsers(uniqueUsers as User[])
                } else {
                    console.error("[AppContext] Failed to fetch users", await usersResponse.text())
                }

            } catch (error) {
                console.error("[AppContext] Error fetching initial data:", error)
            } finally {
                setIsLoaded(true)
            }
        }

        fetchData()
    }, [])

    // ... persistence effects ...
    // Generate unique ID
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Space CRUD
    const createSpace = useCallback(async (data: CreateSpace): Promise<Space> => {
        try {
            const response = await fetch(`${API_URL}/spaces`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to create space")
            }

            const newSpace = await response.json()

            // Ensure date is parsed and fields mapped
            const parsedSpace: Space = {
                id: newSpace.id || newSpace._id,
                companyId: newSpace.companyId || newSpace.company_id,
                name: newSpace.name,
                description: newSpace.description,
                createdAt: new Date(newSpace.createdAt || newSpace.created_at || Date.now())
            }

            setSpaces(prev => {
                if (prev.some(w => w.id === parsedSpace.id)) return prev
                return [...prev, parsedSpace]
            })
            return parsedSpace
        } catch (error) {
            console.error("Error creating space:", error)
            throw error
        }
    }, [])

    const updateSpace = useCallback(async (id: string, data: Partial<Space>) => {
        try {
            const response = await fetch(`${API_URL}/spaces/${company.id}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                console.error("Failed to update space", await response.text())
                throw new Error("Failed to update space")
            }

            const updatedSpace = await response.json()
            const parsedSpace = {
                ...updatedSpace,
                createdAt: new Date(updatedSpace.createdAt)
            }

            setSpaces(prev => prev.map(ws =>
                ws.id === id ? { ...ws, ...parsedSpace } : ws
            ))
        } catch (error) {
            console.error("Error updating space:", error)
            throw error
        }
    }, [company.id])

    const deleteSpace = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/spaces/${company.id}/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.error("Failed to delete space", await response.text())
                throw new Error("Failed to delete space")
            }

            setSpaces(prev => prev.filter(ws => ws.id !== id))
            // Cascade: projects -> epics -> tasks
            const projectsToDelete = projects.filter(p => p.spaceId === id).map(p => p.id)
            setProjects(prev => prev.filter(p => p.spaceId !== id))

            const epicsToDelete = epics.filter(e => projectsToDelete.includes(e.projectId)).map(e => e.id)
            setEpics(prev => prev.filter(e => !projectsToDelete.includes(e.projectId)))

            setTasks(prev => prev.filter(t => !epicsToDelete.includes(t.epicId)))
        } catch (error) {
            console.error("Error deleting space:", error)
            // Ideally notify user
        }
    }, [projects, epics, company.id])

    // Project CRUD
    // Project CRUD
    const createProject = useCallback(async (data: CreateProject): Promise<Project> => {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, companyId: company.id }),
            })

            if (!response.ok) {
                throw new Error("Failed to create project")
            }

            const newProject = await response.json()
            const parsedProject: Project = {
                id: newProject.id || newProject._id,
                name: newProject.name,
                projectKey: newProject.projectKey || newProject.project_key || "KEY",
                description: newProject.description,
                spaceId: newProject.spaceId || newProject.space_id,
                companyId: newProject.companyId || newProject.company_id,
                status: newProject.status || 'active',
                color: newProject.color || '#6366f1',
                assigneeId: newProject.assigneeId || newProject.assignee_id,
                createdAt: new Date(newProject.createdAt || newProject.created_at || Date.now())
            }

            setProjects(prev => [...prev, parsedProject])
            return parsedProject
        } catch (error) {
            console.error("Error creating project:", error)
            throw error
        }
    }, [company.id])

    const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
        try {
            const response = await fetch(`${API_URL}/projects/${company.id}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                console.error("Failed to update project", await response.text())
                throw new Error("Failed to update project")
            }

            const updatedProject = await response.json()
            const parsedProject = {
                ...updatedProject,
                createdAt: new Date(updatedProject.createdAt)
            }

            setProjects(prev => prev.map(p =>
                p.id === id ? { ...p, ...parsedProject } : p
            ))
        } catch (error) {
            console.error("Error updating project:", error)
            throw error
        }
    }, [company.id])

    const deleteProject = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/projects/${company.id}/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.error("Failed to delete project", await response.text())
                throw new Error("Failed to delete project")
            }

            setProjects(prev => prev.filter(p => p.id !== id))
            // Cascade: epics -> tasks
            const epicsToDelete = epics.filter(e => e.projectId === id).map(e => e.id)
            setEpics(prev => prev.filter(e => e.projectId !== id))
            setTasks(prev => prev.filter(t => !epicsToDelete.includes(t.epicId)))

        } catch (error) {
            console.error("Error deleting project:", error)
        }
    }, [epics, company.id])

    // Epic CRUD
    const createEpic = useCallback(async (data: CreateEpic): Promise<Epic> => {
        try {
            const payload = {
                title: data.title,
                summary: data.summary,
                projectId: data.projectId
            }

            const response = await fetch(`${API_URL}/epics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                console.error("Failed to create epic", await response.text())
                throw new Error("Failed to create epic")
            }

            const newEpic = await response.json()
            const parsedEpic: Epic = {
                id: newEpic.id || newEpic._id,
                title: newEpic.title || newEpic.name,
                summary: newEpic.summary || newEpic.description,
                projectId: newEpic.projectId || newEpic.project_id,
                status: newEpic.status || 'todo',
                progress: newEpic.progress || 0,
                assigneeId: newEpic.assigneeId || newEpic.assignee_id,
                createdAt: new Date(newEpic.createdAt || newEpic.created_at || Date.now())
            }

            setEpics(prev => [...prev, parsedEpic])
            return parsedEpic
        } catch (error) {
            console.error("Error creating epic:", error)
            throw error
        }
    }, [])



    const updateEpic = useCallback(async (id: string, data: Partial<Epic>) => {
        try {
            // Logic to find projectId to construct URL, assuming we need it.
            // However, typical REST update might be just /epics/:id or /epics/:projectId/:id
            // User specified: PUT https://.../api/epics/PRJ-1/:id
            // We need to find the project ID for this epic.

            // We can get it from the current epics list or from the data if provided, 
            // but relying on state is safer if data doesn't have it.
            let projectId = data.projectId
            if (!projectId) {
                // Try to find in state
                const existingEpic = epics.find(e => e.id === id)
                if (existingEpic) {
                    projectId = existingEpic.projectId
                }
            }

            if (!projectId) {
                throw new Error("Project ID is required to update epic")
            }

            const response = await fetch(`${API_URL}/epics/${projectId}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                console.error("Failed to update epic", await response.text())
                throw new Error("Failed to update epic")
            }

            const updatedEpic = await response.json()
            const parsedEpic = {
                ...updatedEpic,
                createdAt: new Date(updatedEpic.createdAt)
            }

            setEpics(prev => prev.map(e =>
                e.id === id ? { ...e, ...parsedEpic } : e
            ))
        } catch (error) {
            console.error("Error updating epic:", error)
            throw error
        }
    }, [epics])

    const deleteEpic = useCallback(async (id: string) => {
        try {
            // We need projectId to delete. 
            const existingEpic = epics.find(e => e.id === id)
            if (!existingEpic) {
                console.error("Epic not found for deletion")
                return
            }

            const response = await fetch(`${API_URL}/epics/${existingEpic.projectId}/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.error("Failed to delete epic", await response.text())
                throw new Error("Failed to delete epic")
            }

            setEpics(prev => prev.filter(e => e.id !== id))
            setTasks(prev => prev.filter(t => t.epicId !== id))
        } catch (error) {
            console.error("Error deleting epic:", error)
        }
    }, [epics])

    // Task CRUD
    const createTask = useCallback(async (data: CreateTask): Promise<Task> => {
        console.log("[AppContext] Creating task with payload:", JSON.stringify(data, null, 2))
        try {
            // Prepare payload with mapped values for API
            const payload: any = { ...data }

            // Map status: 'in-progress' -> 'doing'
            if (payload.status === 'in-progress') {
                payload.status = 'doing'
            }

            // Map priority: lowercase -> Title Case
            if (payload.priority) {
                const priorityMap: Record<string, string> = {
                    'low': 'Low',
                    'medium': 'Medium',
                    'high': 'High',
                    'urgent': 'Urgent'
                }
                payload.priority = priorityMap[payload.priority.toLowerCase()] || 'Medium'
            }

            const response = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                console.error("Failed to create task", await response.text())
                throw new Error("Failed to create task")
            }

            const newTask = await response.json()
            const parsedTask: Task = {
                id: newTask.id || newTask._id,
                title: newTask.title || newTask.name,
                description: newTask.description,
                status: (newTask.status === 'doing' ? 'in-progress' : newTask.status) || 'todo',
                priority: (newTask.priority?.toLowerCase() as any) || 'medium',
                epicId: newTask.epicId || newTask.epic_id,
                assigneeId: newTask.assigneeId || newTask.assignee_id,
                labels: newTask.labels || [],
                createdAt: new Date(newTask.createdAt || newTask.created_at || Date.now())
            }

            setTasks(prev => [...prev, parsedTask])
            return parsedTask
        } catch (error) {
            console.error("Error creating task:", error)
            throw error
        }
    }, [])

    const checkBadges = useCallback((userId: string, updatedTasks: Task[]) => {
        const userDoneTasks = updatedTasks.filter(t => t.assigneeId === userId && t.status === 'done')
        const newBadges: UserBadge[] = []

        const hasBadge = (badgeId: string) => userBadges.some(ub => ub.userId === userId && ub.badgeId === badgeId)

        // 1. First Task
        if (userDoneTasks.length >= 1 && !hasBadge("first-task")) {
            newBadges.push({ userId, badgeId: "first-task", earnedAt: new Date() })
        }

        // 2. 10 Tasks
        if (userDoneTasks.length >= 10 && !hasBadge("task-master")) {
            newBadges.push({ userId, badgeId: "task-master", earnedAt: new Date() })
        }

        // 3. 20 Tasks in same Epic
        const epicCounts: Record<string, number> = {}
        userDoneTasks.forEach(t => {
            epicCounts[t.epicId] = (epicCounts[t.epicId] || 0) + 1
        })
        const hasEpicConqueror = Object.values(epicCounts).some(count => count >= 20)
        if (hasEpicConqueror && !hasBadge("epic-conqueror")) {
            newBadges.push({ userId, badgeId: "epic-conqueror", earnedAt: new Date() })
        }

        if (newBadges.length > 0) {
            setUserBadges(prev => [...prev, ...newBadges])
            // In a real app, we might trigger a toast or notification here
        }
    }, [userBadges])

    const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
        // Optimistically update local state
        let previousTasks: Task[] = []
        setTasks(prev => {
            previousTasks = prev
            return prev.map(t =>
                t.id === id ? { ...t, ...data } : t
            )
        })

        try {
            // Prepare payload with mapped values for API
            const payload: any = { ...data }

            // Map status: 'in-progress' -> 'doing'
            if (payload.status === 'in-progress') {
                payload.status = 'doing'
            }

            // Map priority: lowercase -> Title Case
            if (payload.priority) {
                const priorityMap: Record<string, string> = {
                    'low': 'Low',
                    'medium': 'Medium',
                    'high': 'High',
                    'urgent': 'Urgent'
                }
                payload.priority = priorityMap[payload.priority.toLowerCase()] || 'Medium'
            }

            console.log("[AppContext] updateTask payload:", payload)

            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                console.error("Failed to update task", await response.text())
                // Revert to previous state on failure
                setTasks(previousTasks)
                throw new Error("Failed to update task")
            }

            const updatedTask = await response.json()
            const parsedTask = {
                ...updatedTask,
                status: updatedTask.status === 'doing' ? 'in-progress' : updatedTask.status,
                priority: (updatedTask.priority?.toLowerCase() as any) || 'medium',
                createdAt: new Date(updatedTask.createdAt)
            }

            // Confirm update with server data (mostly for things like updatedAt or sanitized fields)
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, ...parsedTask } : t
            ))

            // Check badges only on status change to 'done'
            if (data.status === 'done' && parsedTask.assigneeId) {
                // We need the latest tasks list to check badges correctly
                setTasks(prev => {
                    checkBadges(parsedTask.assigneeId!, prev)
                    return prev
                })
            }

        } catch (error) {
            console.error("Error updating task:", error)
            // Revert to previous state on error
            setTasks(previousTasks)
            throw error
        }
    }, [checkBadges])

    const deleteTask = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.error("Failed to delete task", await response.text())
                throw new Error("Failed to delete task")
            }

            setTasks(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error("Error deleting task:", error)
        }
    }, [])


    // Helpers
    const getSpaceProjects = useCallback((spaceId: string) => {
        return projects.filter(p => p.spaceId === spaceId)
    }, [projects])

    const getProjectEpics = useCallback((projectId: string) => {
        return epics.filter(e => e.projectId === projectId)
    }, [epics])

    const getEpicTasks = useCallback((epicId: string) => {
        return tasks.filter(t => t.epicId === epicId)
    }, [tasks])

    const getUserById = useCallback((userId: string) => {
        return users.find(u => u.id === userId)
    }, [users])

    // User CRUD
    const createUser = useCallback(async (data: Omit<CreateUser, 'companyId'>): Promise<User> => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, companyId: company.id }),
            })

            if (!response.ok) {
                console.error("Failed to create user", await response.text())
                throw new Error("Failed to create user")
            }

            const newUser = await response.json()
            const parsedUser = {
                ...newUser,
                createdAt: new Date(newUser.createdAt),
                lastLogin: new Date(newUser.lastLogin)
            }

            setUsers(prev => [...prev, parsedUser])
            return parsedUser
        } catch (error) {
            console.error("Error creating user:", error)
            throw error
        }
    }, [company.id])

    const updateUser = useCallback(async (id: string, data: Partial<User>) => {
        try {
            const response = await fetch(`${API_URL}/users/${company.id}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                console.error("Failed to update user", await response.text())
                throw new Error("Failed to update user")
            }

            const updatedUser = await response.json()
            const parsedUser = {
                ...updatedUser,
                createdAt: new Date(updatedUser.createdAt),
                lastLogin: new Date(updatedUser.lastLogin)
            }

            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, ...parsedUser } : u
            ))
        } catch (error) {
            console.error("Error updating user:", error)
            throw error
        }
    }, [company.id])

    const deleteUser = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/users/${company.id}/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                console.error("Failed to delete user", await response.text())
                throw new Error("Failed to delete user")
            }

            setUsers(prev => prev.filter(u => u.id !== id))
        } catch (error) {
            console.error("Error deleting user:", error)
        }
    }, [company.id])

    // Label CRUD
    const createLabel = useCallback(async (data: CreateLabel): Promise<Label> => {
        try {
            const response = await fetch(`${API_URL}/labels`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                console.error("Failed to create label", await response.text())
                throw new Error("Failed to create label")
            }

            const newLabel = await response.json()
            const parsedLabel: Label = {
                id: newLabel.id || newLabel._id,
                spaceId: newLabel.spaceId || newLabel.space_id,
                name: newLabel.name,
                color: newLabel.color,
                createdAt: new Date(newLabel.createdAt || newLabel.created_at || Date.now())
            }

            setLabels(prev => [...prev, parsedLabel])
            return parsedLabel
        } catch (error) {
            console.error("Error creating label:", error)
            throw error
        }
    }, [])

    const value: AppContextType = {
        company,
        companies: MOCK_COMPANIES,
        setSelectedCompanyId,
        currentUser: users[0] || {
            id: "",
            fullName: "",
            email: "",
            jobTitle: "",
            globalRole: "member",
            status: "offline",
            avatarUrl: "",
            companyId: "",
            experience: 0,
            expNextLevel: 100,
            level: 1,
            createdAt: new Date(),
            lastLogin: new Date()
        } as User,
        users,
        spaces,
        projects,
        epics,
        tasks,
        labels,
        badges: ALL_BADGES,
        userBadges,
        isLoaded,
        createSpace,
        updateSpace,
        deleteSpace,
        createLabel,
        createProject,
        updateProject,
        deleteProject,
        createEpic,
        updateEpic,
        deleteEpic,
        createTask,
        updateTask,
        deleteTask,
        getSpaceProjects,
        getProjectEpics,
        getEpicTasks,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider")
    }
    return context
}

