
import './App.css'
import { Header } from './components/header'
import { useEffect, useState } from 'react'
import { Pie_Chart } from './components/charts/Pie_Chart'
import { Button } from "@/components/ui/button"

import DataLoad from './components/dataLoad'
import DataInit from './components/dataInit'
import Lasso from './components/lasso'
import Predict from './components/predictor'



function App() {
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lassoLoaded, setLassoLoaded] = useState(false);
  const [go2, setGo2] = useState(false);
  
  const resetAll = () => {
    setIsInitialized(false)
    setDataLoaded(false)
    setLassoLoaded(false)
  }

  const resetData = () => {
    setDataLoaded(false)
    setLassoLoaded(false)
  }
  







return (

<div className="bg-gradient-to-br from-blue-900 via-slate-700 to-blue-900 ">
  <Header></Header>


  <div className="flex flex-row w-4/5 mx-auto justify-center">
    
    <div className="flex flex-col justify-center p-4 w-3/5">  
      {/* Initialize and Load Data */}
      <DataInit initComplete={() => setIsInitialized(true)} bool={isInitialized} />
      <div className="">
        {isInitialized && <DataLoad dataLoadedComplete={() => setDataLoaded(true)} bool={dataLoaded}/>}
      </div>
    </div>

    {/* Initialize and Load Lasso */}
    <div className='flex flex-col justify-center p-4 w-full'>  
        {dataLoaded && <Lasso lassoComplete={() => setLassoLoaded(true)} bool={lassoLoaded}/>}
    </div>
  </div>


  <div className="flex flex-row w-4/5 mx-auto justify-center h-[75vh]">
    {lassoLoaded && <Predict/> }
  </div>

  <div className='flex flex-row justify-center gap-4 mt-8'>

    <Button variant="outline" onClick={resetAll}>Reset Init</Button>
    <Button variant="outline" onClick={resetData}>Reset Data</Button>
    <Button variant="outline" onClick={() => setLassoLoaded(false)}>Reset Lasso</Button>

  </div>

  
</div>

)
}

export default App
