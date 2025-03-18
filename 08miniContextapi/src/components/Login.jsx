import React, { useContext, useState } from 'react'
import UserContext from '../context/UserContext'

export default function Login() {
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const { setUser } = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!username || !password) return
        setUser({username,password})
    }
    return (
        <div className="flex flex-col">
        <input 
            type="text" 
            name="Username" 
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
            type="password" 
            name="Password"
            value={password} 
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}


