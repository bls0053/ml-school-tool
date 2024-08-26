"use client"

import { useState, useEffect } from 'react';
import { LineChartLabel } from './ui/line-chart-label';
import { DoubleBarChart } from './ui/double-bar-chart';

import * as React from "react"
import { Button } from './ui/button';

type LineData = {
    label: string;
    value: number;
};

type BarData = {
    label: string;
    start: number;
    end: number;
};

interface Rows {
    [key: string]: number[]
}


const Predict: React.FC = () => {

    // const [pred, setPred] = useState();
    // const [index, setIndex] = useState();
    const [lineData, setLineData] = useState<LineData[]>([]);
    const [barData, setBarData] = useState<BarData[]>([]);

    const [rows, setRows] = useState<Rows>({});

    const [data, setData] = useState();
    
    
    useEffect(() => {
        predict();

    }, []);

    
    const predict = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/run_predictor');
            const data = await response.json();
        
            if (data.index !== undefined && data.pred !== undefined) {
                setData(data)
                setRows(data.df)
                const newLineData: LineData = {
                    label: String(data.index),
                    value: data.pred
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


    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/fetch_pred');
            const data = await response.json();
        
            if (data.index !== undefined && data.pred !== undefined) {
                setData(data)
                setRows(data.df)
                const newLineData: LineData = {
                    label: String(data.index),
                    value: data.pred
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
          start: ((item.start - min) / (max - min)) + .00000001,
          end: ((item.end - min) / (max - min)) + .00000001
        }));
    };

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
            
            setBarData(normalizedData);
        }
        fetchData()
        
            
    },[rows])




    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full">
            <div className='h-1/2 w-full'>
                <LineChartLabel data={lineData}></LineChartLabel>
                {/* <Button onClick={fetchData}></Button> */}
            </div>
            
            
            <div className='h-1/2 w-full'>
                <DoubleBarChart data={barData}></DoubleBarChart>
            </div>
        </div>
    )
}

export default Predict;
