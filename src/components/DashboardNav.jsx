"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DashboardNav = () => {
    const [user, setUser] = useState(null)
    const handleUser = async () => {
        try {
            const response = await axios.get('/api/user')
            setUser(response.data);
            console.log(response.data);
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        handleUser();
    },[])

    return (
        <div >
            <ul className='flex flex-col h-screen gap-4  overflow-none '>
                {user ? `${user.firstName} ${user.lastName}` : "Loading....."}
            </ul>
        </div>
    )
}

export default DashboardNav
