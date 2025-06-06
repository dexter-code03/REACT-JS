import { useEffect, useState } from 'react'
import ThemeBtn from './components/ThemeBtn'
import Card from './components/Card'
import { ThemeContextProvider } from './contexts/theme'

function App() {
  const [themeMode,setThemeMode] = useState('light')
  const lightMode = () => {
    setThemeMode('light')
  }
  const darkMode = () => {
    setThemeMode('dark')
  }
  useEffect(() => {
    document.querySelector('html').classList.remove("light","dark")
    document.querySelector('html').classList.add(themeMode)
  },[themeMode])

  return (
    <ThemeContextProvider value={{themeMode,lightMode,darkMode}}>
    <div className="flex flex-wrap min-h-screen items-center">
      <div className="w-full">
          <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
                            <ThemeBtn/>
          </div>

          <div className="w-full max-w-sm mx-auto">
                            <Card/>
          </div>
      </div>
    </div>
    </ThemeContextProvider>
  )
}

export default App
