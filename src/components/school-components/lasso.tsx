"use client"
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarNegative } from "@/components/ui/bar-chart-neg.tsx"
import { Button } from '../ui/button';
import * as React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircularProgress } from '@mui/material';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

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
    school: string
    earlyExit: string
    allowedError: string
    targetVal: string
    lock: string[]
    setSchool: (arg0: string) => void
    setEarlyExit: (arg0: string) => void
    setAllowedError: (arg0: string) => void
    setTargetVal: (arg0: string) => void
    setLock: (arg0: string[]) => void

    alpha: string
    tolerance: string
    reduction: string

    lassoComplete: () => void
    loadPredictor: () => void
    predictorClicked: boolean
    goBackToData: () => void
    bool: boolean
}

type Metrics = {
    [key: string]: {
      Metrics: number;
    };
  };

const Lasso: React.FC<LassoProps> = ({ bool, 
    lassoComplete, 
    loadPredictor,
    predictorClicked, 
    goBackToData,
    alpha, 
    tolerance, 
    reduction, 

    school,
    earlyExit,
    allowedError,
    targetVal,
    lock,
    setSchool,
    setEarlyExit,
    setAllowedError,
    setTargetVal,
    setLock

}) => {
    
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" disabled={predictorClicked}>Tune Prediction</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Params</h4>
                            <p className="text-sm text-muted-foreground">
                                Set the parameters for the 'achvz' prediction.
                            </p>
                        </div>
                        <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="school">School Index:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="school"
                                defaultValue={school}
                                onChange={(e) => setSchool(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="ee">Early Exit:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="ee"
                                defaultValue={earlyExit}
                                onChange={(e) => setEarlyExit(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="allerr">Allowed Error:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="allerr"
                                defaultValue={allowedError}
                                onChange={(e) => setAllowedError(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">   
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="tarval">Target Value:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="tarval"
                                defaultValue={targetVal}
                                onChange={(e) => setTargetVal(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="lock">Feature Lock:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="lock"
                                defaultValue={targetVal}
                                onChange={(e) => setTargetVal(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                        </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button variant="outline" onClick={() => loadPredictor()} disabled={predictorClicked}>Proceed</Button>
            </div>
        </div>
    )
}

export default Lasso;
