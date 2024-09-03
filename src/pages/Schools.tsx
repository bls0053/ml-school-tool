
import { Header } from '../components/generic-components/header'
import { useState } from 'react'
import DataLoad from '../components/school-components/dataLoad'
import DataInit from '../components/school-components/dataInit'
import Lasso from '../components/school-components/lasso'
import Predict from '../components/school-components/predictor'





function Schools() {
  
  // Component Load States
  const [isInitialized, setIsInitialized] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lassoLoaded, setLassoLoaded] = useState(false);
  const [predictInitialized, setPredictInitialized] = useState(false);

  // User Proceed States
  const [lassoClicked, setLassoClicked] = useState(false);
  const [predictorClicked, setPredictorClicked] = useState(false);

  // Lasso Params
  const [alpha, setAlpha] = useState<string>('');
  const [tolerance, setTolerance] = useState<string>('');
  const [reduction, setReduction] = useState<string>('0.0');

  // Prediciton Params
  const [school, setSchool] = useState<string>('1');
  const [earlyExit, setEarlyExit] = useState<string>('100');
  const [allowedError, setAllowedError] = useState<string>('.05');
  const [targetVal, setTargetVal] = useState<string>('1');
  const [lock, setLock] = useState<string[]>([]);


  const goBackToData = () => {
    setLassoClicked(false); 
    setLassoLoaded(false); 
    setPredictInitialized(false); 
    setPredictorClicked(false);
  }
  
  const goBackToLasso = () => {
      setPredictInitialized(false)
      setPredictorClicked(false)
  }




return (

<div className="">
  <Header title="School Achievement Hybrid Learning Model"></Header>

  <div className='flex flex-wrap justify-center gap-4 mt-8'>
          {/* <Button variant={"ghost"} onClick={() => setIsInitialized(false)}>setIsInit to FALSE</Button>
          <Button variant={"ghost"} onClick={() => setDataLoaded(false)}>setDataLoaded to FALSE</Button>
          <Button variant={"ghost"} onClick={() => setLassoLoaded(false)}>setLassoLoaded to FALSE</Button>
          <Button variant={"ghost"} onClick={() => setLassoClicked(false)}>setLassoClicked to TRUE</Button>
          <Button variant={"ghost"} onClick={() => setPredictorClicked(false)}>setPredictorClicked to FALSE</Button>
          <Button variant={"ghost"} onClick={() => setPredictInitialized(false)}>setPredictInitialized to FALSE</Button>
   
          <Button onClick={() => {setIsInitialized(false); setDataLoaded(false); }}>setData:Loaded | Init to FALSE</Button>
      
          <Button onClick={() => {setLassoClicked(false); setLassoLoaded(false); setIsInitialized(false); setDataLoaded(false);}}>set: init | loaded | lassoClick | lassoLoaded to FALSE </Button>
      
          <Button onClick={() => { setLassoLoaded(false); setIsInitialized(false); setDataLoaded(false);}}>set: init | loaded | lassoLoaded to FALSE </Button>
     
          <Button variant={"outline"} onClick={() => {setPredictInitialized(false); setPredictorClicked(false);}}>Go Back to Lasso</Button>
        
          <Button variant={"outline"} onClick={() => {setLassoClicked(false); setLassoLoaded(false); setPredictInitialized(false); setPredictorClicked(false);}}>Go Back to Data</Button>
          <Button variant={"ghost"} onClick={() => {setLassoClicked(false); setDataLoaded(false);}}>set: LassoClicked | DataLaoded to FALSE</Button> */}
  </div>

  <div className="flex flex-col md:flex-row w-4/5 mx-auto justify-center">
    
    <div className={`flex flex-col justify-center p-4 transition-all duration-500 ${lassoClicked ? 'w-full md:w-3/5' : 'w-full md:w-full'}`}>
    
      {/* Initialize Data */}
      <DataInit 
        initComplete={() => setIsInitialized(true)} 
        bool={isInitialized}
      />

      <div className="">

        {/* Load Data */}
        {isInitialized && 
        <DataLoad 
          alpha={alpha}
          tolerance={tolerance}
          reduction={reduction}
          setAlpha={setAlpha}
          setTolerance={setTolerance}
          setReduction={setReduction}

          dataLoadedComplete={() => setDataLoaded(true)} 
          loadLasso={() => setLassoClicked(true)} 
          lassoClicked={lassoClicked}
          bool={dataLoaded}/>}

      </div>
    </div>


    
    <div className='flex flex-col justify-center p-4 w-full md:w-2/5 h-[75vh] md:h-auto'>  

        {/* Initialize and Load Lasso */}
        {dataLoaded && 
        lassoClicked && 
        <Lasso 
          school={school}
          earlyExit={earlyExit}
          allowedError={allowedError}
          targetVal={targetVal}
          lock={lock}
          setSchool={setSchool}
          setEarlyExit={setEarlyExit}
          setAllowedError={setAllowedError}
          setTargetVal={setTargetVal}
          setLock={setLock}

          alpha={alpha}
          tolerance={tolerance}
          reduction={reduction}

          goBackToData={() => goBackToData()} 
          lassoComplete={() => setLassoLoaded(true)} 
          loadPredictor={() => setPredictorClicked(true)}
          predictorClicked={predictorClicked} 
          bool={lassoLoaded}/>}

    </div>
  </div>


  <div className="flex flex-row w-4/5 mx-auto justify-center">

    {/* Initialize and fetch Predictions */}
    {lassoLoaded &&
    predictorClicked && 
    <Predict

    earlyExit={earlyExit}
    allowedError={allowedError}
    targetVal={targetVal}
    school={school}
    lock={lock}

    goBackToData={() => goBackToData()} 
    goBackToLasso={() => goBackToLasso()} 
    predictInit={() => setPredictInitialized(true)} 
    bool={predictInitialized}/>}

  </div>

  

  <div className="h-[2000px]"></div>

</div>

)
}

export default Schools;
