import {
    CircleDashed,
    Clock,
    AlertCircle,
    CheckCircle2,
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Siren,
} from "lucide-react"

export const STATUS_OPTIONS = [
    { value: 'todo', label: 'A fazer', icon: CircleDashed },
    { value: 'in-progress', label: 'Em progresso', icon: Clock },
    { value: 'done', label: 'Concluído', icon: CheckCircle2 },
]

export const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Baixa', icon: ArrowDown },
    { value: 'medium', label: 'Média', icon: ArrowRight },
    { value: 'high', label: 'Alta', icon: ArrowUp },
    { value: 'urgent', label: 'Urgente', icon: Siren },
]
