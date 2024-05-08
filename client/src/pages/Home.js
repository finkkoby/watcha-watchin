import { Link, Outlet } from 'react-router-dom'

import '../css/Home.css'

function Home() {
    return (
        <>
            <div className='page-header'>
                <h3>welcome!</h3>
            </div>
            <div className='page-body'>
                <div className='links'>
                    <Link to='/login'>login</Link>
                    <Link to='/signup'>signup</Link>
                    <Link to='/join'>join</Link>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Home;