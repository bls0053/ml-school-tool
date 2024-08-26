"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  start: {
    label: "start",
    color: "hsl(var(--chart-variant-1))",
  },
  end: {
    label: "end",
    color: "hsl(var(--chart-variant-5))",
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
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="h-4/6 w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <BarChart accessibilityLayer barCategoryGap="10%" barGap={1} data={data}>
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
      <CardFooter className="flex-col items-start gap-2 text-sm ">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
