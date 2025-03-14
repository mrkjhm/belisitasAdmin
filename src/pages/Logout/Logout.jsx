import React, { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../../Context/UserContext'

export default function Logout() {
    
    const { unsetUser, setUser } = useContext(UserContext);

    unsetUser();

    useEffect(() => {
        setUser({access: null})
    },[])

    return (
        <Navigate to="/login" />
    )
}
