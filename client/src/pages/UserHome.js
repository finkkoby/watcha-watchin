import { useEffect, useContext } from 'react'
import { Outlet, Link, useLocation } from'react-router-dom'

import AppContext from '../context/AppContext'

import '../css/UserHome.css'

function UserHome() {
    const { navigate, user } = useContext(AppContext)

    const { pathname } = useLocation()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    })

    useEffect(() => {
        fetch('/api/check_session')
            .then((response) => {
                 if (!response.ok) {
                     navigate('/login')
                 }
            })
    }, [])

    return (
        <div>
            <Outlet />
            { pathname !== '/user' ? (
                <div className='page-footer'>
                    <Link to='/user'>back to dashboard</Link>
                </div>
            ) : null}
        </div>
    )
}

export default UserHome;