"use client"

import { useState, useEffect } from 'react';
import { BarNegative } from "@/components/ui/bar-chart-neg.tsx"
import { Button } from './ui/button';
import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

type CoefficientData = {
    [key: string]: {
      Coefficients: number;
    };
  };
  
type ChartData = {
    label: string;
    value: number;
};

interface DataInitProps {
    lassoComplete: () => void
    bool: boolean
}

const Lasso: React.FC<DataInitProps> = ({ lassoComplete, bool }) => {
    
    const [metrics, setMetrics] = useState(null);
    const [coefs, setCoefs] = useState<CoefficientData>({});
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [originalData, setOriginalData] = useState<ChartData[]>([]);




    useEffect(() => {
        if (bool == false) {
            lasso();
            
        }
        else {
            return;
        }
    }, [lassoComplete]);

    

    const lasso = async () => {
        await fetch(`http://127.0.0.1:5000/api/lasso`)
        .then(response => response.json())
        .then(data => {
            setCoefs(data.coefficients)
            console.log(data.coefficients)
        })
        .catch(error => console.error('Error fetching data:', error));
        lassoComplete()
        
        
    };


    const sortAscending = () => {
        const sortedData = [...chartData].sort((a, b) => a.value - b.value);
        setChartData(sortedData);
    };

    const sortDescending = () => {
        const sortedData = [...chartData].sort((a, b) => b.value - a.value);
        setChartData(sortedData);
    };  
    
    const sortAlphaAsc = () => {
        const sortedData = [...chartData].sort((a, b) => a.label.localeCompare(b.label));
        setChartData(sortedData);
    };  

    const sortAlphaDesc = () => {
        const sortedData = [...chartData].sort((a, b) => b.label.localeCompare(a.label));
        setChartData(sortedData);
    };  

    const sortUnsorted = () => {
        setChartData(originalData);
    };  


    useEffect(() => {
        const transformedData: ChartData[] = Object.entries(coefs).map(([label, { Coefficients }]) => ({
            label,
            value: parseFloat(Coefficients.toFixed(4))
        }));
        setChartData(transformedData)
        setOriginalData(transformedData)
    }, [coefs])


    useEffect(() => {
        console.log(chartData)
    }, [chartData])


    return (
        
        <div className='flex flex-col gap-2 h-full w-full'>

            <div className='h-full'>
                <BarNegative data={chartData}></BarNegative>
            </div>
                
            <div className='flex flex-row gap-2 justify-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">Sort</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Ordering</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortUnsorted}
                            >
                        Unsorted
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortAscending}
                           
                            >
                        Ascending (value)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortDescending}
                            >
                        Descending (value)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortAlphaAsc}
                            >
                        Ascending (label)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortAlphaDesc}
                            >
                        Descending (label)
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Lasso;
