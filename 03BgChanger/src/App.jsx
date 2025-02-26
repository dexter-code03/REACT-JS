import { useState } from 'react'

function App() {
  let [color, setColor] = useState("olive")
  

  return (
      <div className="w-full h-screen duration-200"
      style={{backgroundColor:color}}
      >
        <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
          <div className="flex flex-wrap justify-center gap-3 shadow-lg px-3 py-2 rounded-3xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%)',
            backdropFilter: 'blur(8px)'
          }}
          >
            <button className="outline-none px-3 text-white rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #ff6666 0%, #ff0000 100%)',
              border: '2px solid #ff3333',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
            }}
            onClick={() => setColor('red')}
            >Red</button>
            <button className="outline-none px-3 text-white rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #66ff66 0%, #008000 100%)',
              border: '2px solid #00cc00',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
            }}
            onClick={() => setColor('green')}
            >Green</button>
            <button className="outline-none px-3 text-black rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #ffff99 0%, #ffff00 100%)',
              border: '2px solid #ffff33',
              boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)'
            }}
            onClick={() => setColor('yellow')}
            >Yellow</button>
            <button className="outline-none px-3 text-white rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #6666ff 0%, #0000ff 100%)',
              border: '2px solid #3333ff',
              boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)'
            }}
            onClick={() => setColor('blue')}
            >Blue</button>
            <button className="outline-none px-3 text-black rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #f0e6ff 0%, #e6e6fa 100%)',
              border: '2px solid #d8bfd8',
              boxShadow: '0 0 10px rgba(230, 230, 250, 0.5)'
            }}
            onClick={() => setColor('lavender')}
            >Lavender</button>
            <button className="outline-none px-3 text-white rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #a6a6a6 0%, #808080 100%)',
              border: '2px solid #666666',
              boxShadow: '0 0 10px rgba(128, 128, 128, 0.5)'
            }}
            onClick={() => setColor('gray')}
            >Gray</button>
            <button className="outline-none px-3 text-white rounded-full py-1 border-1 border-black"
            style={{
              background: 'radial-gradient(circle at center, #cc66ff 0%, #800080 100%)',
              border: '2px solid #9932cc',
              boxShadow: '0 0 10px rgba(128, 0, 128, 0.5)'
            }}
            onClick={() => setColor('purple')}
            >Purple</button>
          </div>
        </div>
      </div>
  )
}

export default App
