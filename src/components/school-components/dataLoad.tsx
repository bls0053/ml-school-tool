import { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/school-components/data-table"
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

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
    alpha: string
    tolerance: string
    reduction: string
    setAlpha: (arg0: string) => void
    setTolerance: (arg0: string) => void
    setReduction: (arg0: string) => void

    dataLoadedComplete: () => void
    loadLasso: () => void
    lassoClicked: boolean
    bool: boolean
}


const DataLoad: React.FC<DataLoadProps> = ({ bool, lassoClicked, dataLoadedComplete, loadLasso,
    alpha, tolerance, reduction, setAlpha, setTolerance, setReduction}) => {


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
        
        await fetch(`https://ml-school-flask-production.up.railway.app/api/get_data?start=${newStart}&limit=${limit}`)
        
            .then(response => response.json())
            .then(newData => {
                setData(newData); 
                setStart(newStart);
                
            })

            .catch(error => console.error('Error fetching data:', error));
            dataLoadedComplete()
            
    
    };


    const fetchLength = async () => {
        await fetch(`https://ml-school-flask-production.up.railway.app/api/get_length`)
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


  

    function handleCheckboxChange(num: number) {
        return (checked: boolean) => {
            if (checked) {
                let newStart = num * (Math.floor(start/num));
                setStart(newStart);
                setLimit(num);
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
                        {start===0 ? 1 : Math.floor(start/limit) + 1} / {Math.ceil(length/limit) + 1} 
                    </div>
                    <Button variant="outline" onClick={() => fetchData("next")}><ArrowRight/></Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">#PerPage</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-28">
                        <DropdownMenuLabel>Entries / Page</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(25)}>25
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(50)}>50
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onCheckedChange={handleCheckboxChange(100)}>100
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" disabled={lassoClicked}>Tune Lasso</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Params</h4>
                            <p className="text-sm text-muted-foreground">
                            Set the parameters for the Lasso model.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="alpha">Alpha:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Regularization parameter:</p> 
                                            <p>Responsible for the penalty applied to coefficients - can help reduce overfitting.</p>
                                            <p>As Alpha increases, more coefficients are reduced to 0.</p>
                                            <p>Typically a value from [0.1 - 0.00001]</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="alpha"
                                defaultValue={alpha}
                                onChange={(e) => setAlpha(e.target.value)}
                                className="col-span-2 h-8"
                            />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="tolerance">Tolerance:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Convergence Criterion:</p> 
                                            <p>Responsible for determining when the algorithm halts.</p>
                                            <p>As Tolerance increases, the algorithm might stop too early.</p>
                                            <p>As Tolerance decreases, the algorithm becomes more precise - but also may not converge.</p>
                                            <p>Typically a value from [0.1 - 0.000001]</p>
                                        </div>
                                            
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="tolerance"
                                defaultValue={tolerance}
                                onChange={(e) => setTolerance(e.target.value)}
                                className="col-span-2 h-8"
                            />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Label htmlFor="reduction">Reduction:</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className='flex flex-col gap-2 w-72'>
                                            <p>Reduction Threshold:</p> 
                                            <p>Arbitrary non-Lasso threshold variable for removing coefficients.</p>
                                            <p>Can be used to remove coefficients under a desired value.</p>
                                            <p>Typically a value of [0.1 &gt; reduction &gt; 0 ]</p>
                                            <p>A reduction of 0 will remove only fully reduced coefficients.</p>
                                        </div>
                                            
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Input
                                id="reduction"
                                defaultValue={reduction}
                                onChange={(e) => setReduction(e.target.value)}
                                className="col-span-2 h-8"
                            />
                            </div>
                        </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button variant="outline" onClick={() => loadLasso()} disabled={lassoClicked}>Proceed</Button>
            </div>
                
        </div>
    );

}

export default DataLoad;
