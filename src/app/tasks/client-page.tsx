"use client"

import { useApp } from "@/contexts/app-context"
import { TasksView } from "@/components/tasks-view"

export default function TasksPageClient() {
    const { tasks } = useApp()

    return <TasksView tasks={tasks} />
}
