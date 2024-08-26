import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { Button } from './ui/button';


interface School {
    [key: string]: any;
}

interface DataLoadProps {
    dataLoadedComplete: () => void
    bool: boolean
}

const DataLoad: React.FC<DataLoadProps> = ({ bool, dataLoadedComplete }) => {

    console.log(bool)

    const [data, setData] = useState<School[]>([]);
    const [length, setLength] = useState(0);
    
    const [columns, setColumns] = useState<ColumnDef<School, any>[]>([]);
    const [start, setStart] = useState(0);
    const limit = 50; 

    const fetchData = async (direction: string | undefined) => {

        if (direction === "next") {
            setStart(start + limit);
        } 
        else if (direction === "prev" && start > 0) {
            setStart(start - limit);
        }
        else if (direction === "curr") {
            setStart(start);
        }

        await fetch(`http://127.0.0.1:5000/api/get_data?start=${start}&limit=${limit}`)
            .then(response => response.json())
            .then(newData => {
                setData(newData); 
                if (direction === "next") {
                    setStart(start + limit);
                }
                else if (direction === "prev" && start > 0) {
                    setStart(start - limit);
                }
                
            })

            .catch(error => console.error('Error fetching data:', error));
            dataLoadedComplete()
            
    
    };


    const fetchLength = async () => {
        await fetch(`http://127.0.0.1:5000/api/get_length`)
        .then(response => response.json())
        .then(newLength => {
            setLength(newLength);
        })

    }



    useEffect(() => {
        if (bool == false) {
            let dir = "curr";
            fetchData(dir);
        }
        else {
            return;
        }
    }, [dataLoadedComplete]);


    useEffect(() => {
        fetchLength()
    }, [])

    useEffect(() => {
        console.log("data: ", data)
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            const dynamicColumns = keys.map(key => ({
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
            }));
            setColumns(dynamicColumns);
        }
    }, [data])

    useEffect(() => { console.log("col: ", columns) }, [columns])




    return (
        <div className='flex flex-col gap-2'>

            <div >
                <DataTable  columns={columns} data={data} />
            </div>
                
            <div className='flex flex-row gap-2 justify-center'>
                <Button onClick={() => fetchData("prev")} disabled={start === 0}>&lt;-</Button>
                <div className='bg-slate-600 bg-opacity-35 text-white rounded-md p-2'>
                    {start===0 ? 1 : start/limit} / {Math.ceil(length/limit)}
                </div>
                <Button onClick={() => fetchData("next")}>-&gt;</Button>
            </div>

        </div>
    );

}

export default DataLoad;
