import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import YouTube from 'react-youtube'

import AppContext from '../context/AppContext'
import '../css/ViewingRoom.css'
import ViewingRoomLoading from '../components/ViewingRoomLoading'
import URLForm from '../components/URLForm'
import Chat from '../components/Chat'

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
                if (data) {
                    handleNewRecent(data)
                }
            })

            s.on('disconnect', () => {
                console.log('disconnected from join namespace')
            })

            return (() => {
                handleLeave(s)
                if (!join.host) {
                    handleDeleteJoin()
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

    function handleNewRecent(video) {
        fetch('/api/recents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user.id,
                video: video.id
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(res => {
                    user.recents.push(res)
                    setUser({...user})
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
        })
    }
    function handleHostUpdate(event) {
        socket.emit('hostupdate', {name: room.name, event: event.target.playerInfo})
    }

    function handleUpdateFromHost(newTarget, player) {
        console.log("I'm being called")
        console.log(player)
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

    function handleNewVideo() {
        setRoom({...room, video: null})
        socket.emit("video_update", { name: room.name, video: null })
    }

    const userCards = roomJoins.map(j => {
        return (
            <p key={j.user.id} className={ j.host ? "host" : null}>{j.user.username}</p>
        )
    })

    
    return (
        <div className='viewing-room'>
            <h1>{room.name}</h1>
            <div className='viewing-room-container'>
                <div id='vr-column-1' className='vr-box'>
                    { room.video ? (
                        <YouTube videoId={room.video.youtube_id} onReady={handleReady} onStateChange={join.host ? handleHostUpdate : null}></YouTube>
                    ) : join.host && !room.video ? (
                        <URLForm socket={socket}/>
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
                    { join.host ? (
                        <>
                            <button id='delete-room' onClick={() => handleDeleteRoom()}>delete room</button> 
                            <button id='new-video' onClick={() => handleNewVideo()}>new video</button>
                        </>
                        ) : <button id='leave-room' onClick={() => handleDeleteJoin()}>leave room</button> }
                </div>
            </div>
        </div>
    )
}

export default ViewingRoom;