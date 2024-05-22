import { useContext, useState, useEffect } from "react";

import AppContext from "../context/AppContext";

function UserDashboard() {
    const { user, room, navigate, setRoom, setJoin } = useContext(AppContext);

    if (!user) {
        return <h1>loading...</h1>
    }


    const myRooms = user.rooms.map(room => {
        return (
            <div key={room.id}>
                <button onClick={() => handleEnterRoom(room)}>{room.name}</button>
            </div>
        )
    })

    function handleEnterRoom(room) {
        console.log(room)
        setJoin(user.joins.find(join => join.room.id === room.id))
        fetch('/api/rooms/join', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: room.id
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(res => {
                    setRoom(res)
                    navigate(`/user/room/${res.id}`)
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
        })
    }

    return (
        <div className='dash-container'>
            <div id='column1' className='dash-column'>
                <div className='dash-box' id='button-bar'>
                    { room ? <button id='rejoin' onClick={() => navigate(`/user/room/${room.id}`)}>rejoin {room.name}</button> :
                    <>
                        <button id='create-room' onClick={() => navigate('/user/room/new')}>create room</button>
                        <button id='join-room' onClick={() => navigate('/user/room/join')}>join room</button>
                    </>
                    }
                </div>
                <div className='dash-box' id='recent-videos'>
                    <h3>my rooms</h3>
                        <div id='my-rooms-list'>
                            { myRooms }
                        </div>
                </div>
            </div>
            <div id='column2' className='dash-column'>
                <div className='dash-box' id='friends-list'>
                    <h3>friends</h3>
                    <div id='friends-list-list'>
                        <p>friend 1</p>
                        <p>friend 2</p>
                        <p>friend 3</p>
                    </div>
                </div>
                <div className='dash-box' id='recent-videos'>
                    <h3>recent videos</h3>
                    <div id='recent-videos-list'>
                        <p>video 1</p>
                        <p>video 2</p>
                        <p>video 3</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard;