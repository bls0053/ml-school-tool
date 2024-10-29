"use client"


import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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
  start: {
    label: "start",
    color: "hsl(var(--chart-variant-2))",
  },
  end: {
    label: "end",
    color: "hsl(var(--chart-variant-1))",
  },
} satisfies ChartConfig



interface Element {
  label: string
  start: number;
  end: number;
}

type Data = Element[];

interface BarChartProps {
  data: Data; 
}


export function DoubleBarChart({ data }: BarChartProps ) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="h-4/6 w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <BarChart accessibilityLayer barCategoryGap="20%" barGap={2} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis type="number" scale="auto"/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="start" fill="var(--color-start)" radius={4}  />
            <Bar dataKey="end" fill="var(--color-end)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}
