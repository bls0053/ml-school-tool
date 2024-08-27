"use client"

import { useState, useEffect } from 'react';
import { LineChartLabel } from '../ui/line-chart-label';
import { DoubleBarChart } from '../ui/double-bar-chart';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import * as React from "react"
import { Button } from '../ui/button';
import { CircularProgress } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

type LineData = {
    label: string;
    achvz: number;
};

type BarData = {
    label: string;
    start: number;
    end: number;
};

interface Rows {
    [key: string]: number[]
}

type Metrics = {
    [key: string]: {
      Metrics: number;
    };
  };

interface PredictProps {
    predictInit: () => void
    goBackToData: () => void
    goBackToLasso: () => void
    bool: boolean
}

const Predict: React.FC<PredictProps> = ({ bool, predictInit, goBackToLasso, goBackToData }) => {

    // const [pred, setPred] = useState();
    // const [index, setIndex] = useState();
    const [lineData, setLineData] = useState<LineData[]>([]);
    const [barData, setBarData] = useState<BarData[]>([]);
    const [metrics, setMetrics] = useState<Metrics>({});

    const [rows, setRows] = useState<Rows>({});
    const [data, setData] = useState();
    const [normal, setNormal] = useState(true);
    
    
    useEffect(() => {

        console.log("pred{bool:", bool, "}")

        if (bool==false) {

            console.log("pred{ initialized pred }")

            predict();
        }
        else {
            return;
        }
        
    }, [predictInit]);



    const predict = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/run_predictor');
            const data = await response.json();
        
            if (data.index !== undefined && data.pred !== undefined) {
                setData(data)
                setRows(data.df)
                setMetrics(data.metrics)
                const newLineData: LineData = {
                    label: String(data.index),
                    achvz: data.pred
                };
                setLineData(prevData => [...prevData, newLineData]);
            } 
            else {
              console.error('Invalid data received:', data);
            }
        } 
        catch (error) {
            console.error('Error fetching data:', error);
        }
        predictInit()
    };


    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/fetch_pred');
            const data = await response.json();

            if (data.index == 111 && data.pred == 111) {
                return;
            }
        
            if (data.index !== undefined && data.pred !== undefined) {
                setData(data)
                setRows(data.df)
                console.log(metrics)
                const newLineData: LineData = {
                    label: String(data.index),
                    achvz: data.pred
                };
                setLineData(prevData => [...prevData, newLineData]);
            } 
            else {
              console.error('Invalid data received:', data);
            }
        } 
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const normalizeData = (data: any[]) => {
        const values = data.flatMap(item => [item.start, item.end]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        console.log(...values);
        console.log("max: ", max);
        console.log("min: ", min);

        return data.map(item => ({
          ...item,
          start: ((item.start - min) / (max - min)),
          end: ((item.end - min) / (max - min))
        }));
    };

    const toggleNormal = (() => {
        setNormal(!normal)
    })

    useEffect(() => {
        console.log(data)

        if (rows) {
            const processedData: BarData[] =  Object.keys(rows).map(key => {
                return {
                    label: key,
                    start: rows[key][0],
                    end: rows[key][rows[key].length - 1]
                };
            });
            const normalizedData = normalizeData(processedData);
            console.log('Normalized Data:', normalizedData);
            
            if (normal) {
                setBarData(normalizedData);
            }
            else {
                setBarData(processedData);
            } 
        }
       
        if (bool) {
            fetchData()
        }
    },[rows, normal])


    if (!bool) {
        return (
            <div className="">
                <CircularProgress/>
            </div>
        )
    }

    return (
        
        <div className="flex flex-col gap-4 p-4 w-full h-[75vh]">
            
            <div className='h-1/2 w-full'>
                <LineChartLabel data={lineData}></LineChartLabel>
                {/* <Button onClick={fetchData}></Button> */}
            </div>
            
            
            <div className='h-1/2 w-full'>
                <DoubleBarChart data={barData}></DoubleBarChart>
            </div>
            
            <div className='flex flex-row gap-2 justify-center'>
                <Button variant="outline" onClick={() => goBackToData()}><ArrowLeft/>Back To Data</Button>
                <Button variant="outline" onClick={() => goBackToLasso()}><ArrowLeft/>Back To Lasso</Button>
                <Button variant="outline" onClick={() => toggleNormal()}>Normalize</Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">Metrics</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Extra Trees Regressor Metrics</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {Object.entries(metrics).map(([key, value]) => (
                            <DropdownMenuCheckboxItem key={key}>
                                {`${key}: ${value.Metrics}`}
                            </DropdownMenuCheckboxItem>))}

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default Predict;
