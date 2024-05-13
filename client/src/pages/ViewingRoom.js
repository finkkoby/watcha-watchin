import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext from '../context/AppContext'

function ViewingRoom() {
    const { id } = useParams()
    const [room, setRoom] = useState(null)
    const [error, setError] = useState(false)

    const { user, setUser, handleUpdate, navigate } = useContext(AppContext)

    useEffect(() => {
        try {
            if (user.room && user) {
                fetch(`/api/rooms/${id}/${user.room.code}`)
                .then(r => {
                    if (r.ok) {
                    r.json().then(res => {
                        setRoom(res)
                    })
                    } else {
                    r.json().then(res => {
                        navigate('/user/room/join')
                    })
                    }
                })
                return (() => {
                    setError(false)
                    handleUpdate({...user, "room": null})
                })
            }
        } catch {
            navigate('/user/room/join')
        }
    }, [])
    
    return (
        <div className='viewing-room-container'>
            <p>This is the viewing room section for my site.</p>
            <p>{room ? room.name : null}</p>
        </div>
    )
}

export default ViewingRoom;