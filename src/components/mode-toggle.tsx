"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Toggle } from "@/components/ui/toggle"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Evita problemas de hydration
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Toggle variant="outline" aria-label="Alternar tema" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Toggle>
        )
    }

    const isDark = resolvedTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <Toggle
            variant="outline"
            aria-label="Alternar tema"
            pressed={isDark}
            onPressedChange={toggleTheme}
        >
            {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
        </Toggle>
    )
}
