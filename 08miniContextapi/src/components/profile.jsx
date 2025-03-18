import React, { useContext } from 'react'
import UserContext from '../context/UserContext'

export default function Profile() {
    const {user} = useContext(UserContext)
    if(user) {
        return (`welcome ${user.username}`)
    }else{
        return ('Please Login')
    }
}
