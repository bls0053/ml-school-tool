import { useEffect } from 'react';



interface DataInitProps {
    initComplete: () => void
    bool: boolean
}

const DataInit: React.FC<DataInitProps> = ({ initComplete, bool }) => {
    
    useEffect(() => {
        if (bool==false) {
            initData();
        }
        else {
            return;
        }
    }, [initComplete]);
    
    const initData = async () => {
        const response = await fetch(`http://127.0.0.1:5000/api/init_data`, {method: 'GET'})
        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        else {
            initComplete();
        }
    }

    return (
        <div></div>
    );
    
}

export default DataInit;
