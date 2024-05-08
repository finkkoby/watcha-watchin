import { Link } from 'react-router-dom'

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
                <div className='about-body'>
                    <p>This is the about section for my site.</p>
                </div>
            </div>
        </>
    )
}

export default Home;