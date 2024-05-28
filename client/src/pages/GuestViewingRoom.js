import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import YouTube from 'react-youtube'

import AppContext from '../context/AppContext'
import '../css/ViewingRoom.css'
import ViewingRoomLoading from '../components/ViewingRoomLoading'
import URLForm from '../components/URLForm'
import Chat from '../components/Chat'

function GuestViewingRoom() {
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
                if (data.id === join.id) {
                    handleSelfJoin(data)
                } else {
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

            return (() => {
                handleLeave(s)
                if (!join.host) {
                    handleDeleteGuest()
                }
            })
        }
    }, [])

    if (!user || !room || !join) {
        return <ViewingRoomLoading />
    }

    function handleSelfJoin(data) {
        setRoomJoins([...room.joins], data)
    }

    function handleAddJoin(data) {
        setRoomJoins([...room.joins])
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

    function handleDeleteGuest() {
        fetch(`/api/users/${user.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(r => {
            if (r.ok) {
                r.json().then(res => {
                    setUser(false)
                    navigate('/login')
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
        })
    }

    function handleUpdateFromHost(newTarget, player) {
        if (player) {
            player.seekTo(newTarget['currentTime'])
            if (newTarget.playerState === 1) {
                player.playVideo()
            } else if (newTarget.playerState === 2) {
                player.pauseVideo()
            } else if (newTarget.playerState === 3) {
                player.pauseVideo()
            }
        }
    }

    function handleReady(event) {
        const player = event.target
        socket.on('statechange', data => {
            if (!join.host && data) {
                console.log(data)
                handleUpdateFromHost(data, player)
            }
        })
    }

    const userCards = roomJoins.map(j => {
        return (
            <p key={j.user.id} className={ j.host ? "host" : null}>{ j.user.username ? j.user.username : j.user.first_name}</p>
        )
    })

    return (
        <div className='viewing-room'>
        <h1 id='room-name'>{room.name}</h1>
        <div className='viewing-room-container'>
            <div id='vr-column-1' className='vr-box'>
                { room.video ? (
                    <YouTube videoId={room.video.youtube_id} onReady={handleReady}></YouTube>
                ) : (
                    <h1>waiting for host...</h1>
                )}
            </div>
            <div id='vr-column-2' className='vr-box'>
                <Chat socket={socket}/>
            </div>
        </div>
        <div id='vr-room-info'>
            <h1 id='room-code'>{room.code}</h1>
            <div id='vr-users-container'>
                <h2>current users</h2>
                { userCards }
            </div>
            <div id='vr-buttons'>
                <button id='leave-room' onClick={() => handleDeleteGuest()}>leave room</button>
            </div>
        </div>
    </div>
    )
}

export default GuestViewingRoom;