import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';


interface DataInitProps {
    initComplete: () => void
    bool: boolean
}

const DataInit: React.FC<DataInitProps> = ({ initComplete, bool }) => {
    
    useEffect(() => {

        console.log("dataInit{bool:", bool, "}")

        if (bool==false) {

            console.log("dataInit{ initialized data }")

            initData();
        }
        else {
            return;
        }
    }, [initComplete]);
    
    const initData = async () => {
        const promise = await fetch(`https://ml-school-flask-production.up.railway.app/api/init_data`, {method: 'GET'})
        if (!promise.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            throw new Error(`HTTP error! Status: ${promise.status}`);
        }
        else {
            initComplete();
        }
    }


    if (!bool) {
        return (
            <div className="">
                
            </div>
        )
    }


    return (
        <div></div>
    );
    
}

export default DataInit;
