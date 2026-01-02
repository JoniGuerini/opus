"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { STATUS_OPTIONS } from "@/constants/task-options"
import { cn } from "@/lib/utils"
import { CircleDashed } from "lucide-react"

interface StatusSelectProps {
    value: string
    onValueChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function StatusSelect({
    value,
    onValueChange,
    className,
    placeholder = "Selecionar status"
}: StatusSelectProps) {
    const status = value?.toLowerCase()

    const getStatusIcon = (currentStatus: string) => {
        const option = STATUS_OPTIONS.find(s => s.value === currentStatus)
        const Icon = option?.icon || CircleDashed

        let colorClass = "text-muted-foreground"
        if (currentStatus === 'done') colorClass = "text-green-500"
        if (currentStatus === 'in-progress') colorClass = "text-blue-500"

        return <Icon className={cn("h-4 w-4", colorClass)} />
    }

    const getStatusLabel = (currentStatus: string) => {
        return STATUS_OPTIONS.find(s => s.value === currentStatus)?.label || currentStatus
    }

    return (
        <Select value={status} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    "h-8 border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0 px-2 gap-2 transition-all",
                    className
                )}
            >
                <SelectValue placeholder={placeholder}>
                    <div className="flex items-center gap-2">
                        {status ? (
                            <>
                                {getStatusIcon(status)}
                                <span className="font-medium text-xs">
                                    {getStatusLabel(status)}
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="bg-popover border-muted/20">
                {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                option.value === 'done' ? "text-green-500" :
                                    option.value === 'in-progress' ? "text-blue-500" :
                                        "text-muted-foreground"
                            )}>
                                <option.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm">{option.label}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
