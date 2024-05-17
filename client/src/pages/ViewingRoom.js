import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext from '../context/AppContext'

function ViewingRoom() {
    const { id } = useParams()
    const [error, setError] = useState(false)

    const { user, room, handleUpdate, navigate } = useContext(AppContext)

    if (!room) {
        navigate('/')
    }

    useEffect(() => {
        return (() => {
            if (user) {
                handleUpdate({...user, "room": null})
            }})
    }, [])

    
    return (
        <div className='viewing-room-container'>
            <p>This is the viewing room section for my site.</p>
            <p>{room ? room.name : null}</p>
        </div>
    )
}

export default ViewingRoom;