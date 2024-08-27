import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { CircularProgress } from '@mui/material';
import { DataTable } from "@/components/school-components/data-table"
import { Button } from '../ui/button';


import { ArrowLeft, ArrowRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

interface School {
    [key: string]: any;
}

interface DataLoadProps {
    dataLoadedComplete: () => void
    loadLasso: () => void
    bool: boolean
}


const DataLoad: React.FC<DataLoadProps> = ({ bool, dataLoadedComplete, loadLasso }) => {


    const [data, setData] = useState<School[]>([]);
    const [length, setLength] = useState(0);
    
    const [columns, setColumns] = useState<ColumnDef<School, any>[]>([]);
    const [start, setStart] = useState(0);
    const [limit, setLimit] = useState(25);

    const fetchData = async (direction: string | undefined) => {

    
        let newStart = start;
        if (direction === "next") {
            newStart = start + limit;
        } else if (direction === "prev" && start > 0) {
            newStart = start - limit;
        } else if (direction === "curr") {
            newStart = start;
        }
        
        await fetch(`http://127.0.0.1:5000/api/get_data?start=${newStart}&limit=${limit}`)
        
            .then(response => response.json())
            .then(newData => {
                setData(newData); 
                setStart(newStart);
                
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

        console.log("dataLoad{bool:", bool, "}")

        if (bool == false) {

            console.log("dataLoad{ fetched data }")

            let dir = "curr";
            fetchData(dir);
        }
        else {
            return;
        }
    }, [dataLoadedComplete]);


    useEffect(() => {
        fetchLength()
        fetchData("curr")
    }, [limit])

    useEffect(() => {

        console.log(data)
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            const dynamicColumns = keys.map(key => ({
                accessorKey: key,
                header: key.charAt(0).toUpperCase() + key.slice(1),
                
            }));
            setColumns(dynamicColumns);
        }
    }, [data])

    useEffect(() => { 
       console.log("dataLoad:{columns: ", columns, "}") 
    },[columns])


    function pageFormat(num: number) {
        return setLimit(num);
    };  

    function handleCheckboxChange(num: number) {
        return (checked: boolean) => {
            if (checked) {
                pageFormat(num);
            }
        };
    }

    if (!bool) {
        return (
            <div className="">
                
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-2'>

            <div >
                <DataTable  columns={columns} data={data}/>
            </div>
            <div className="flex flex-row gap-2 justify-center">
                <div className='flex flex-row gap-2 justify-center'>
                    <Button variant="outline" onClick={() => fetchData("prev")} disabled={start === 0}><ArrowLeft/></Button>
                    <div className='bg-slate-600 bg-opacity-35 text-white rounded-md p-2'>
                        {start===0 ? 1 : (start/limit) + 1} / {Math.ceil(length/limit) + 1} 
                    </div>
                    <Button variant="outline" onClick={() => fetchData("next")}><ArrowRight/></Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">Sort</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-28">
                        <DropdownMenuLabel>Entries / Page</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(25)}
                            >
                        25
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(50)}
                           
                            >
                        50
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(100)}
                            >
                        100
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" onClick={() => loadLasso()}>Proceed</Button>
            </div>
                
        </div>
    );

}

export default DataLoad;
