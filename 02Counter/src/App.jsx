import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [counter,setCounter] = useState(15);
  
  const addValue = () =>{
    counter = counter+1;
    setCounter(counter);
  }
  const removeValue = () =>{
    if(counter>=1)
    {
      counter = counter-1;
      setCounter(counter);
    }
  }

  return (
    <>
     <h1>Chai with Code</h1>
     <h2>{counter}</h2>
     <button onClick={addValue}>addValue</button>
     <br/>
     <button onClick={removeValue}>removeValue</button>
    </>
  )
}

export default App
