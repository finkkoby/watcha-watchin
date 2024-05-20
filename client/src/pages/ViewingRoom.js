import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

import AppContext from '../context/AppContext'

function ViewingRoom() {
    const [error, setError] = useState(false)

    const { user, room, handleUpdate, navigate } = useContext(AppContext)

    if (!room) {
        navigate('/')
    }

    useEffect(() => {
        const s = io('/join')

        s.on('connect', () => {
            console.log('connected to join namespace')
            s.emit('join', room.name)
        })

        s.on('joined', (data) => {
            console.log(data)
        })

        s.on('left', data => {
            console.log(`left ${room.name}`)
        })

        s.on('disconnect', () => {
            console.log('disconnected from join namespace')
        })

        return () => {
            s.emit('leave', room.name)
        }

    }, [room])

    useEffect(() => {
        return (() => {
            if (user) {
                handleUpdate({...user, "room": null})
            }})
    }, [])

    
    return (
        <div className='viewing-room-container'>
            <div id='vr-column-1'>
                <div id='vr-room-info'>
                    <h3 id='room-name'>{room.name}</h3>
                    <p id='room-code'>{room.code}</p>
                </div>
                <div id='vr-users-container'>
                    <ul id='vr-user-list'>
                    </ul>
                </div>
            </div>
            <div id='vr-column-2'></div>
            <div id='vr-column-3'></div>
        </div>
    )
}

export default ViewingRoom;