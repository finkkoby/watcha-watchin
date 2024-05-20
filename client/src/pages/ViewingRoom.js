import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

import AppContext from '../context/AppContext'

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
        <div className='viewing-room-container'>
            <div id='vr-column-1'>
                <div id='vr-room-info'>
                    <h3 id='room-name'>{room ? room.name : 'loading...'}</h3>
                    <h5 id='room-code'>{room ? room.code : 'loading...'}</h5>
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
            <div id='vr-column-2'>
                <iframe height='315' width='420'></iframe>
            </div>
            <div id='vr-column-3'></div>
        </div>
    )
}

export default ViewingRoom;