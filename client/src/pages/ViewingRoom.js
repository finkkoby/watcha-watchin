import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import YouTube from 'react-youtube'

import AppContext from '../context/AppContext'
import '../css/ViewingRoom.css'
import ViewingRoomLoading from '../components/ViewingRoomLoading'
import URLForm from '../components/URLForm'

function ViewingRoom() {
    const [error, setError] = useState(false)
    const [socket, setSocket] = useState(false)

    const { user, setUser, room, setRoom, join, setJoin, navigate } = useContext(AppContext)

    console.log(join)

    useEffect(() => {
        if (room) {
            const s = io('/join')

            setSocket(s)

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

            s.on('new_video', data => {
                setRoom({...room, video: data})
            })

            s.on('disconnect', () => {
                console.log('disconnected from join namespace')
            })

            return (() => {
                handleLeave(s)
            })
        }
    }, [])

    if (!user || !room || !join) {
        return <h1>loading...</h1>
    }

    function handleLeave(socket) {
        socket.emit('leave', room.name)
        fetch('/api/rooms/leave')
        .then(r => {
            if (r.ok) {
                r.json().then(res => {
                    console.log('left socket room')
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
        })
    }

    function handleDeleteJoin() {
        fetch(`/api/joins/${join.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
        }})
       .then(r => {
            if (r.ok) {
                r.json().then(res => {
                    const newJoins = user.joins.map(j => {
                        if (j.id !== join.id) {
                            return j
                        }
                    })
                    setUser({...user, joins : newJoins})
                    setRoom(null)
                    setJoin(null)
                    navigate('/user')
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
       })
    }

    function handleDeleteRoom() {
        fetch(`/api/rooms/${room.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
        }})
       .then(r => {
        if (r.ok) {
            r.json().then(res => {
                const newJoins = user.joins.filter(j => j.room.id !== room.id)
                const newRooms = user.rooms.filter(r => r.id !== room.id)
                setUser({...user, joins : newJoins, rooms : newRooms})
                setRoom(null)
                setJoin(null)
                navigate('/user')
            })
        } else {
            r.json().then(res => {
                console.log(res.message)
            })
        }
       })
    }

    
    return (
        <>
            <h1>{room.name}</h1>
            <div className='viewing-room-container'>
                <div id='vr-column-1' className='vr-column'>
                    <div id='vr-room-info'>
                        <h1 id='room-code'>{room.code}</h1>
                    </div>
                    <div id='vr-users-container'>
                        <ul id='vr-user-list'>
                            <li>user1</li>
                            <li>user2</li>
                            <li>user3</li>
                            <li>user4</li>
                        </ul>
                    </div>
                    { join.host ? 
                    <button id='delete-room' onClick={() => handleDeleteRoom()}>delete room</button> 
                    : <button id='leave-room' onClick={() => handleDeleteJoin()}>leave room</button> }
                </div>
                <div id='vr-column-2' className='vr-column'>
                    { room.video ? (
                        <YouTube videoId={room.video.youtube_id}></YouTube>
                    ) : join.host && !room.video ? (
                        <URLForm socket={socket}/>
                    ) : (
                        <h1>waiting for host...</h1>
                    )}
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