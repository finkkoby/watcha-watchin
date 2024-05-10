import { useEffect, useContext } from 'react'
import { Outlet } from'react-router-dom'

import AppContext from '../context/AppContext'

import '../css/UserHome.css'

function UserHome() {
    const { navigate, user } = useContext(AppContext)

    useEffect(() => {
        fetch('/api/check_session')
            .then((response) => {
                 if (!response.ok) {
                     navigate('/login')
                 }
            })
    }, [])

    return (
        <div className='user-home'>
            <Outlet />
        </div>
    )
}

export default UserHome;