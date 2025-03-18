import Login from './components/Login'
import Profile from './components/profile'
import UserContextProvider from './context/UserContextProvider'

function App() {
  

  return (
    <UserContextProvider>
      <div className="h-screen w-full flex flex-col justify-center items-center ">
        <Login/>
        <Profile/>
      </div>
    </UserContextProvider>
  )
}

export default App
