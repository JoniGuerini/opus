
import {
    CircleUser,
    Shield,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    MinusCircle
} from "lucide-react"
import { UserRole, UserStatus } from "@/types"

export const USER_ROLE_OPTIONS = [
    {
        label: "Administrador",
        value: "admin" as UserRole,
        icon: Shield,
    },
    {
        label: "Membro",
        value: "member" as UserRole,
        icon: CircleUser,
    },
    {
        label: "Visualizador",
        value: "viewer" as UserRole,
        icon: Eye,
    },
]

export const USER_STATUS_OPTIONS = [
    {
        label: "Ativo",
        value: "active" as UserStatus,
        icon: CheckCircle2,
    },
    {
        label: "Ocupado",
        value: "busy" as UserStatus,
        icon: XCircle,
    },
    {
        label: "Ausente",
        value: "away" as UserStatus,
        icon: Clock,
    },
    {
        label: "Offline",
        value: "offline" as UserStatus,
        icon: MinusCircle,
    },
]
