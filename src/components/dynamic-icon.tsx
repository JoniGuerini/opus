"use client"

import * as Icons from "lucide-react"
import { LucideIcon, LucideProps } from "lucide-react"
import React from "react"

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
    name: string
    fallback?: LucideIcon
}

export function DynamicIcon({ name, fallback: Fallback = Icons.Folder, ...props }: DynamicIconProps) {
    // Get the icon from lucide-react by name
    const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[name]

    if (!IconComponent) {
        return <Fallback {...props} />
    }

    return <IconComponent {...props} />
}
