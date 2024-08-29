"use client"
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarNegative } from "@/components/ui/bar-chart-neg.tsx"
import { Button } from '../ui/button';
import * as React from "react"



import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircularProgress } from '@mui/material';


type CoefficientData = {
    [key: string]: {
      Coefficients: number;
    };
  };
  
type ChartData = {
    label: string;
    value: number;
};

interface LassoProps {
    alpha: string
    tolerance: string
    reduction: string

    lassoComplete: () => void
    loadPredictor: () => void
    goBackToData: () => void
    bool: boolean
}

type Metrics = {
    [key: string]: {
      Metrics: number;
    };
  };

const Lasso: React.FC<LassoProps> = ({ bool, lassoComplete, loadPredictor, goBackToData,
    alpha, tolerance, reduction, }) => {
    
    const [metrics, setMetrics] = useState<Metrics>({});
    const [coefs, setCoefs] = useState<CoefficientData>({});
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [originalData, setOriginalData] = useState<ChartData[]>([]);




    useEffect(() => {

        console.log("lasso{bool:", bool, "}")

        if (bool == false) {
            lasso(alpha, tolerance, reduction);
            
            console.log("lasso{ loading lasso }")

        }
        else {
            return;
        }
    }, [lassoComplete]);

    

    const lasso = async (alpha: string, tolerance: string, reduction: string) => {

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/lasso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    alpha: alpha,
                    tolerance: tolerance,
                    reduction: reduction
            }),
        });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                const data = await response.json();
                setCoefs(data.coefficients)
                setMetrics(data.metrics)
                console.log(data.coefficients)
                console.log(data.metrics)
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        lassoComplete();
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


    if (!bool) {
        return (
            <div className="">
                <CircularProgress/>
            </div>
        )
    }


    return (
        
        <div className='flex flex-col gap-2 h-full w-full'>

            <div className='h-full'>
                <BarNegative data={chartData}></BarNegative>
            </div>
                
            <div className='flex flex-row flex-wrap justify-center gap-2'>
                <Button variant="outline" onClick={() => goBackToData()}><ArrowLeft/>Back To Data</Button>
                
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
                        Ascending (numerical)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortDescending}
                            >
                        Descending (numerical)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortAlphaAsc}
                            >
                        Ascending (alphabetical)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={sortAlphaDesc}
                            >
                        Descending (alphabetical)
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">Metrics</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Lasso Metrics</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {Object.entries(metrics).map(([key, value]) => (
                            <DropdownMenuCheckboxItem key={key}>
                                {`${key}: ${parseFloat(value.Metrics.toFixed(3))}`}
                            </DropdownMenuCheckboxItem>))}

                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" onClick={() => loadPredictor()}>Proceed</Button>
            </div>
        </div>
    )
}

export default Lasso;
