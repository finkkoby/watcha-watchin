import { useEffect, useContext } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import AppContext from "../context/AppContext";

function GuestHome() {
    const { navigate, guest } = useContext(AppContext)
    
    const { pathname } = useLocation()

    useEffect(() => {
        return (() => {
            fetch(`/api/guests/${guest.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(r => {
                if (r.ok) {
                    navigate('/')
                } else {
                    r.json().then(res => {
                        console.log(res.message)
                    })
                }
            })
        })
    })

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