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
      <h1 className="text-white text-center py-1 my-3 ">Password Generator</h1>
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={pass}
          className="outline-none w-full py-1 px-3 bg-white"
          placeholder="Password"
          readOnly
          ref={passref}
        />
        <button className=" outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 "
        onClick={()=>(copypassword())}
        >
          copy
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
