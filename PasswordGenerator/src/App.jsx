import { useState, useCallback, useEffect,useRef } from 'react'

function App() {
  const [len,setLen] = useState(8)
  const [num,setNum] = useState(false)
  const [char,setChar] = useState(false)
  const [pass,setPass] = useState()
  const passref = useRef(null)
  const copypassword = useCallback(() => {
    let val = passref.current?.select();
    window.navigator.clipboard.writeText(val)
  },[pass])
  const passwordGenerator = useCallback(()=>{
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(num) str+="0123456789"
    if(char) str+="!@#$%^&*(){}?><"
    for (let i = 0; i < len; i++) {
      let p = Math.floor(Math.random() * str.length)
      pass += str.charAt(p)
    }
    setPass(pass)
  },[len,num,char,setPass])
  useEffect(()=>{
    passwordGenerator()
  },[len,num,char,setPass])

  return (
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
      <h1 className="text-white text-center font-bold text-2xl py-1 my-3 ">Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={pass}
          className="outline-none w-full py-1 px-3 bg-white"
          placeholder="Password"
          readOnly
          ref={passref}
        />
        <button 
        className="outline-none bg-blue-700 text-white px-4 py-2 shrink-0
          transition-all duration-300 ease-in-out
          hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50
          active:transform active:scale-95
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          rounded-r-lg font-semibold
          flex items-center gap-2"
        onClick={() => copypassword()}
      >
        <span>Copy</span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </button>
      </div>
      <div className="flex text-sm gap-x-2">
        <div className="flex items-center gap-x-1">
          <input 
          type="range"
          min={1}
          max={100}
          value={len}
          className="cursor-pointer bg-blue-700"
          onChange={(e)=>{setLen(e.target.value)}} 
          />
          <label>Length:{len}</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input 
          type="checkbox" 
          defaultChecked={num}
          onChange={()=>{
            setNum((prev)=>!prev)
          }}
          />
          <label htmlFor="NumInput">Number</label>
        </div>
        <div className="flex items-center gap-x-1">
          <input 
          type="checkbox" 
          defaultChecked={char}
          onChange={()=>{
            setChar((prev)=>!prev)
          }}
          />
          <label htmlFor="CharInput">Characters</label>
        </div>
      </div>

    </div>
  )
}

export default App
