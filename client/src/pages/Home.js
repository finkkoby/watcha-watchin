import { NavLink, Outlet } from 'react-router-dom'

import '../css/Home.css'

function Home() {
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
        </>
    )
}

export default Home;