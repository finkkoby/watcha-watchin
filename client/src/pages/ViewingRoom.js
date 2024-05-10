import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext from '../context/AppContext'

function ViewingRoom() {
    const { id } = useParams()
    const [room, setRoom] = useState(null)
    const [error, setError] = useState(false)

    const { user, setUser, handleUpdate } = useContext(AppContext)

    useEffect(() => {
        return (() => {
            setError(false)
            handleUpdate({...user, "room": null})
        })
    }, [])

    useEffect(() => {
        fetch(`/api/rooms/${id}`)
        .then(r => {
            if (r.ok) {
            r.json().then(res => {
                setRoom(res)
            })
            } else {
            r.json().then(res => {
                setError(res)
                console.log(res)
            })
            }
        })
        return (() => {
            // const newUser = {...user, "room": null}
            // handleUpdate(newUser)
       })
    }, [])
    
    return (
        <div className='viewing-room-container'>
            <p>This is the viewing room section for my site.</p>
            <p>{room ? room.name : null}</p>
        </div>
    )
}

export default ViewingRoom;