"use client"

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
  achvz: {
    label: "achvz",
    color: "hsl(var(--chart-variant-1))",
  }
} satisfies ChartConfig


interface Element {
  label: string;
  achvz: number;
}

type Data = Element[];

interface LineChartProps {
  data: Data; 
}

export function LineChartLabel({ data }: LineChartProps ) {
    return (
        <Card className="flex flex-col h-full w-full">
            <CardHeader className="">
                <CardTitle>Model Progress</CardTitle>
                <CardDescription></CardDescription>
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
                        dataKey="achvz"
                        type="natural"
                        stroke="var(--color-achvz)"
                        strokeWidth={2}
                        dot={{
                            fill: "var(--color-achvz)",
                        }}
                        activeDot={{
                            r: 6,
                        }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            
        </Card>
  )
}
