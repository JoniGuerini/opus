"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PRIORITY_OPTIONS } from "@/constants/task-options"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface PrioritySelectProps {
    value: string
    onValueChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function PrioritySelect({
    value,
    onValueChange,
    className,
    placeholder = "Selecionar prioridade"
}: PrioritySelectProps) {
    const priority = value?.toLowerCase()

    const getPriorityIcon = (currentPriority: string) => {
        const option = PRIORITY_OPTIONS.find(p => p.value === currentPriority)
        const Icon = option?.icon || ChevronRight

        let colorClass = "text-muted-foreground"
        if (currentPriority === 'urgent') colorClass = "text-red-500"
        if (currentPriority === 'high') colorClass = "text-orange-500"
        if (currentPriority === 'medium') colorClass = "text-blue-500"

        return <Icon className={cn("h-4 w-4", colorClass)} />
    }

    const getPriorityLabel = (currentPriority: string) => {
        return PRIORITY_OPTIONS.find(p => p.value === currentPriority)?.label || currentPriority
    }

    return (
        <Select value={priority} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    "h-8 border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0 px-2 gap-2 transition-all",
                    className
                )}
            >
                <SelectValue placeholder={placeholder}>
                    <div className="flex items-center gap-2">
                        {priority ? (
                            <>
                                {getPriorityIcon(priority)}
                                <span className="font-medium text-xs">
                                    {getPriorityLabel(priority)}
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="bg-popover border-muted/20">
                {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                option.value === 'urgent' ? "text-red-500" :
                                    option.value === 'high' ? "text-orange-500" :
                                        option.value === 'medium' ? "text-blue-500" :
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
