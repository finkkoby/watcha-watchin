import { Link, Outlet } from 'react-router-dom'

function Home() {
    return (
        <>
            <div className='page-header'>
                <h3>welcome!</h3>
            </div>
            <div className='page-body'>
                <Outlet />
                <div className='links'>
                    <Link to='/login'>login</Link>
                    <Link to='/signup'>signup</Link>
                    <Link to='/join'>join</Link>
                </div>
            </div>
        </>
    )
}

export default Home;