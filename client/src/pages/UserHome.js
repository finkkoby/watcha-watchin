import { useEffect, useContext } from 'react'
import { Outlet } from'react-router-dom'

import AppContext from '../context/AppContext'

function UserHome() {
    const { navigate } = useContext(AppContext)

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
            <h3>welcome to your home page!</h3>
            <Outlet />
        </div>
    )
}

export default UserHome;