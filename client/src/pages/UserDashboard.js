import { useContext, useState, useEffect } from "react";

import {CopyToClipboard} from 'react-copy-to-clipboard';

import AppContext from "../context/AppContext";

function UserDashboard() {
    const { user, join, navigate, setRoom, setJoin } = useContext(AppContext);

    if (!user) {
        return <h1>loading...</h1>
    }

    console.log(user)
    const myRooms = user.joins.map(j => {
        return (
            <div key={j.room.id}>
                <button onClick={() => handleEnterRoom(j.room)}>{j.room.name}</button>
            </div>
        )
    })

    const myRecents = user.recents.map(r => {
        return (
            <div key={r.id}>
                <img src={r.video.image_url} />
                <p>{r.video.title}</p>
                <CopyToClipboard text={r.video.url}>
                    <button>copy link</button>
                </CopyToClipboard>
            </div>
        )
    })

    myRecents.reverse()

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
                    { join ? <button id='rejoin' onClick={() => navigate(`/user/room/${join.room.id}`)}>rejoin {join.room.name}</button> :
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
                <div className='dash-box' id='recent-videos'>
                    <h3>recent videos</h3>
                    <div id='recent-videos-list'>
                        { myRecents[0] }
                        { myRecents[1] }
                        { myRecents[2] }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard;