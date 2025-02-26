import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/Card'

function App() {
  return (
    <>
      <h1 class='bg-green-400 underline text-black text-bold rounded-xl p-4 mb-4' >TailwindProps</h1>
      <Card username='vyom' content='my name is khan'/>
      <br />
      <Card username='hitesh' content='my name is Chai with Code'/>
    </>
  )
}

export default App
