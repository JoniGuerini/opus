"use client"

import { Badge, UserBadge } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgesListProps {
    badges: Badge[]
    userBadges: UserBadge[]
    userId: string
}

export function BadgesList({ badges, userBadges, userId }: BadgesListProps) {
    const earnedBadgeIds = userBadges
        .filter(ub => ub.userId === userId)
        .map(ub => ub.badgeId)

    return (
        <Card className="border shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Conquistas
                </CardTitle>
                <CardDescription>
                    Medalhas desbloqueadas por suas atividades.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {badges.map((badge) => {
                        const isEarned = earnedBadgeIds.includes(badge.id)

                        return (
                            <TooltipProvider key={badge.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={`
                                            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-default
                                            ${isEarned
                                                ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                                                : "bg-muted/30 border-dashed opacity-60 hover:opacity-80"
                                            }
                                        `}>
                                            <div className={`
                                                text-3xl filter transition-all
                                                ${isEarned ? "drop-shadow-md" : "grayscale blur-[0.5px]"}
                                            `}>
                                                {badge.icon}
                                            </div>
                                            <div className="text-center space-y-0.5 w-full">
                                                <p className={`text-xs font-medium truncate w-full ${isEarned ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {badge.name}
                                                </p>
                                                {!isEarned && (
                                                    <Lock className="h-3 w-3 mx-auto text-muted-foreground/50" />
                                                )}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={10} className="p-4 max-w-[220px]">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 border-b pb-2">
                                                <span className="text-2xl filter drop-shadow-sm">{badge.icon}</span>
                                                <div className="space-y-0.5">
                                                    <p className="font-semibold text-sm leading-none">{badge.name}</p>
                                                    <p className={`text-[10px] font-medium uppercase tracking-wider ${isEarned ? "text-primary" : "text-muted-foreground"}`}>
                                                        {isEarned ? "Desbloqueada" : "Bloqueada"}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {badge.description}
                                            </p>
                                            {isEarned && (
                                                <div className="flex items-center gap-1 text-[10px] text-primary pt-1">
                                                    <Award className="h-3 w-3" />
                                                    <span>Conquista obtida</span>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
