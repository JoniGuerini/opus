"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Jan", tarefas: 186, projetos: 80 },
    { month: "Fev", tarefas: 305, projetos: 200 },
    { month: "Mar", tarefas: 237, projetos: 120 },
    { month: "Abr", tarefas: 73, projetos: 190 },
    { month: "Mai", tarefas: 209, projetos: 130 },
    { month: "Jun", tarefas: 214, projetos: 140 },
]

const chartConfig = {
    tarefas: {
        label: "Tarefas",
        color: "var(--chart-1)",
    },
    projetos: {
        label: "Projetos",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function OverviewChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="tarefas" fill="var(--color-tarefas)" radius={4} />
                <Bar dataKey="projetos" fill="var(--color-projetos)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
