import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import YouTube from 'react-youtube'

import AppContext from '../context/AppContext'
import '../css/ViewingRoom.css'

function ViewingRoom() {
    const [error, setError] = useState(false)

    const { user, room, setRoom, handleUpdate, navigate } = useContext(AppContext)

    useEffect(() => {
        if (room) {
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

            return (() => {
                s.emit('leave', room.name)
                fetch('/api/rooms/leave')
                .then(r => {
                    if (r.ok) {
                        r.json().then(res => {
                            const newUser = {...user, "room": null}
                            setRoom(null)
                            handleUpdate(newUser)
                        })
                    } else {
                        r.json().then(res => {
                            console.log(res)
                            setError(true)
                        })
                    }
                })
            })
        }
    }, [])

    
    return (
        <>
            <h1>{room ? room.name : 'loading...'}</h1>
            <div className='viewing-room-container'>
                <div id='vr-column-1' className='vr-column'>
                    <div id='vr-room-info'>
                        <h1 id='room-code'>{room ? room.code.toUpperCase() : 'loading...'}</h1>
                    </div>
                    <div id='vr-users-container'>
                        <ul id='vr-user-list'>
                            <li>user1</li>
                            <li>user2</li>
                            <li>user3</li>
                            <li>user4</li>
                        </ul>
                    </div>
                </div>
                <div id='vr-column-2' className='vr-column'>
                    <YouTube videoId='GafXVg0cWck'></YouTube>
                </div>
                <div id='vr-column-3' className='vr-column'>
                    <div id='chat-container'>
                        <h1>chat</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewingRoom;