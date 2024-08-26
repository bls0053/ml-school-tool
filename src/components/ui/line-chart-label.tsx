"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-variant-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-variant-2))",
  },
} satisfies ChartConfig


interface Element {
  label: string;
  value: number;
}

type Data = Element[];

interface LineChartProps {
  data: Data; 
}

export function LineChartLabel({ data }: LineChartProps ) {
    return (
        <Card className="flex flex-col h-full w-full">
            <CardHeader className="">
                <CardTitle>Line Chart - Dots</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-4/6">
                <ChartContainer className="w-full h-full" config={chartConfig}>
                    <LineChart 
                        accessibilityLayer
                        data={data}
                        margin={{
                        left: 12,
                        right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis type="number"/>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                        dataKey="value"
                        type="natural"
                        stroke="var(--color-desktop)"
                        strokeWidth={2}
                        dot={{
                            fill: "var(--color-desktop)",
                        }}
                        activeDot={{
                            r: 6,
                        }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start text-sm w-full">
                <div className="flex font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="" />
                </div>
                <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
  )
}
