"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ReactNode } from "react"

interface AlertConfirmProps {
    trigger: ReactNode
    title?: string
    description?: string
    onConfirm: () => void
    cancelText?: string
    confirmText?: string
    variant?: "default" | "destructive"
}

export function AlertConfirm({
    trigger,
    title = "Você tem certeza?",
    description = "Esta ação não pode ser desfeita.",
    onConfirm,
    cancelText = "Cancelar",
    confirmText = "Confirmar",
    variant = "destructive",
}: AlertConfirmProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
