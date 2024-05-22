import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import YouTube from 'react-youtube'

import AppContext from '../context/AppContext'
import '../css/ViewingRoom.css'
import ViewingRoomLoading from '../components/ViewingRoomLoading'
import URLForm from '../components/URLForm'

function ViewingRoom() {
    const { user, setUser, room, setRoom, join, setJoin, navigate } = useContext(AppContext)

    const [error, setError] = useState(false)
    const [socket, setSocket] = useState(false)
    const [roomJoins, setRoomJoins] = useState([])

    useEffect(() => {
        if (room) {
            // STATE IS CAPTURED WHEN USEEFFECT IS RENDERED
            const s = io('/join')

            setSocket(s)

            s.on('connect', () => {
                console.log('connected to join namespace')
                s.emit('join', {room: room.name, join: join})
            })

            s.on('joined', (data) => {
                if (data.id !== join.id) {
                    handleAddJoin(data)
                }
            })

            s.on('left', data => {
                if (data.join.id !== join.id) {
                    handleRemoveJoin(data.join)
                }
            })

            s.on('new_video', data => {
                setRoom({...room, video: data})
            })

            s.on('disconnect', () => {
                console.log('disconnected from join namespace')
            })
            
            if (room.joins) {
                setRoomJoins(room.joins)
                console.log("Hello")
            } else {
                setRoomJoins([])
            }

            return (() => {
                handleLeave(s)
                if (!join.host) {
                    handleDeleteJoin()
                }
            })
        }
    }, [])

    if (!user || !room || !join) {
        return <h1>loading...</h1>
    }

    function handleAddJoin(join) {
        setRoomJoins([...room.joins, join])
    }

    function handleRemoveJoin(join) {
        setRoomJoins(room.joins.filter(j => j.id !== join.id))
    }

    function handleLeave(socket) {
        socket.emit('leave', {room: room.name, join: join})
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
                    const newJoins = user.joins.filter(j => j.id !== join.id)
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

    const userCards = roomJoins.map(j => {
        return (
            <p key={j.user.id}>{j.user.username}{ j.host ? " HOST" : null}</p>
        )
    })

    
    return (
        <>
            <h1>{room.name}</h1>
            <div className='viewing-room-container'>
                <div id='vr-column-1' className='vr-column'>
                    <div id='vr-room-info'>
                        <h1 id='room-code'>{room.code}</h1>
                    </div>
                    <div id='vr-users-container'>
                        { userCards }
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