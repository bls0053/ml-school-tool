"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

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

interface Element {
    label: string;
    value: number;
  }
  
type Data = Element[];



interface BarNegativeProps {
    data: Data; 
}

const chartConfig = {
  value: {
    label: "Coef: ",
  },
} satisfies ChartConfig

export function BarNegative({ data }: BarNegativeProps) {
  return (
    <Card className="h-full bg-slate-800 bg-opacity-30">
      <CardHeader>
        <CardTitle>Bar Chart - Negative</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="h-5/6 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart className=""
            layout="vertical"
            data={data}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" 
                dataKey="label" 
                width={95} 
                textAnchor="end" 
                tick={{ textAnchor: "end", fontSize: 9 }} 
                tickMargin={1} 
                padding={{ top: 0, bottom: 0 }}
                interval={0}
                
            />
                
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="value">
              <LabelList position="left" dataKey="value" fillOpacity={1} />
              {data.map((item) => (
                <Cell
                  key={item.label}
                  fill={
                    item.value > 0
                      ? "hsl(var(--chart-variant-1))"
                      : "hsl(var(--chart-variant-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}