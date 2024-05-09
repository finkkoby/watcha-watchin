import { useEffect } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'

import '../css/Home.css'

function Home() {
    const { pathname } = useLocation()

    return (
        <>
            <div className='page-header'>
                <h3>welcome!</h3>
            </div>
            <div className='page-body'>
                <div className='links'>
                    <NavLink to='/login'>login</NavLink>
                    <NavLink to='/signup'>signup</NavLink>
                    <NavLink to='/join'>join</NavLink>
                </div>
                <Outlet />
            </div>
            { pathname !== '/' ? (
                <div className='page-footer'>
                    <Link to='/'>learn more</Link>
                </div>
            ) : null}
        </>
    )
}

export default Home;