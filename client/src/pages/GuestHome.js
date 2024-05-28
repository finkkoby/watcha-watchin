import { useEffect, useContext } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import AppContext from "../context/AppContext";

function GuestHome() {
    const { navigate, guest } = useContext(AppContext)
    
    const { pathname } = useLocation()


    return (
        <div>
            <Outlet />
            { pathname !== '/guest' ? (
                <div className='page-footer'>
                    <Link to='/'>back to home</Link>
                </div>
            ) : null}
        </div>
    )
}

export default GuestHome;