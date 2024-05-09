import { useEffect, useContext } from 'react'

import AppContext from '../context/AppContext'

function UserHome() {
    const { navigate } = useContext(AppContext)

    return (
        <div className='user-home'>
            <h3>welcome to your home page!</h3>
        </div>
    )
}

export default UserHome;