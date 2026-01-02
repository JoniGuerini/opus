"use client"

import * as React from "react"
import {
    X,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/constants/task-options"

export interface TasksToolbarProps {
    search: string
    setSearch: (value: string) => void
    statusFilter: Set<string>
    setStatusFilter: (value: Set<string>) => void
    priorityFilter: Set<string>
    setPriorityFilter: (value: Set<string>) => void
    children?: React.ReactNode // For ActionButton or ViewOptions
}

export function TasksToolbar({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    children,
}: TasksToolbarProps) {
    const isFiltered = statusFilter.size > 0 || priorityFilter.size > 0 || search.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filtrar tarefas..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                <FacetedFilter
                    title="Status"
                    options={STATUS_OPTIONS}
                    selectedValues={statusFilter}
                    onSelect={setStatusFilter}
                />

                <FacetedFilter
                    title="Prioridade"
                    options={PRIORITY_OPTIONS}
                    selectedValues={priorityFilter}
                    onSelect={setPriorityFilter}
                />

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("")
                            setStatusFilter(new Set())
                            setPriorityFilter(new Set())
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Resetar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {children}
            </div>
        </div>
    )
}
