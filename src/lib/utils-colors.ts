
import { Label } from "@/types"

export const getLabelColorClass = (colorName: string | undefined | null) => {
    if (!colorName) return 'bg-gray-500'
    switch (colorName.toUpperCase()) {
        case 'RED': return 'bg-red-500'
        case 'BLUE': return 'bg-blue-500'
        case 'GREEN': return 'bg-green-500'
        case 'YELLOW': return 'bg-yellow-500'
        case 'ORANGE': return 'bg-orange-500'
        case 'PURPLE': return 'bg-purple-500'
        case 'PINK': return 'bg-pink-500'
        case 'GRAY': return 'bg-gray-500'
        default: return 'bg-gray-500'
    }
}
