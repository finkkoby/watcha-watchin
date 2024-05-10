import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ViewingRoom() {
    const { id } = useParams()
    const [room, setRoom] = useState(null)
    const [error, setError] = useState(false)

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
    }, [])
    
    return (
        <div className='viewing-room-container'>
            <p>This is the viewing room section for my site.</p>
            <p>{room ? room.name : null}</p>
        </div>
    )
}

export default ViewingRoom;