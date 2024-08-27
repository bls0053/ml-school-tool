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
    <Card className="h-full w-full">
      <CardHeader className="h-[10%] w-full">
        <CardTitle>Lasso Regression</CardTitle>
        <CardDescription className="p-2">
            Shown below is lasso feature importance
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[80%] w-full">
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
      <CardFooter className="flex-col items-start gap-2 text-sm h-[10%] w-full">
        <div className="flex gap-2 font-medium leading-none text-muted-foreground">
          The larger the magnitude of a coefficient, 
          the higher the relationship it has on the target variable (achvz).
        </div>
        <div className="leading-none text-muted-foreground">
          Positive values denote as the feature increases, the target variable increases. 
          Negative values have an inverse relationship.
        </div>
      </CardFooter>
    </Card>
  )
}