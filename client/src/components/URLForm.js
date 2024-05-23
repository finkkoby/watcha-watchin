import { useContext, useEffect, useState } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import getVideoId from 'get-video-id'

import AppContext from '../context/AppContext'

function URLForm({ socket }) {
    const [error, setError] = useState(false)

    const { room, setRoom } = useContext(AppContext)

    useEffect(() => {
        return (() => {
            setError(false)
        })
    }, [])
    
    const formSchema = yup.object().shape({
        url: yup.string().required("please enter a valid youtube URL")
    })

    function handleVideoURL(url) {
        const { id } = getVideoId(url)
        return id
    }

    function handleVideoInfo(id, url) {
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyAM756mv-2hLkVGeemHfNbPL9i62Kcw3X8%20&part=snippet`)
        .then(r => {
            if (r.ok) {
                r.json().then(res => {
                    handleNewVideo(res.items[0].snippet.title, res.items[0].snippet.thumbnails.default.url, url, id)
                })
            } else {
                r.json().then(res => {
                    setError(res.message)
                })
            }
        })
    }

    function handleNewVideo(title, thumbnail_url, url, youtubeId) {
        fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                image_url: thumbnail_url,
                url: url,
                youtube_id: youtubeId
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(res => {
                    console.log(res)
                    handleRoomUpdate(res)
                })
            } else {
                r.json().then(res => {
                    setError(res.message)
                })
            }
        })
    }

    function handleRoomUpdate(video) {
        fetch(`/api/rooms/${room.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: room.name,
                videoId: video.id
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(res => {
                    setRoom(res)
                    socket.emit('video_update', {name: room.name, video: video})
                })
            } else {
                r.json().then(res => {
                    console.log(res.message)
                })
            }
        })
    }

    return (
        <div className='form-container page-body'>
            <Formik
                initialValues={{
                    url: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    const youtubeId = handleVideoURL(values.url)
                    if (youtubeId) {
                        handleVideoInfo(youtubeId, values.url)
                    } else {
                        setError('please enter a valid youtube URL')
                        return
                    }
                }}
            >
                {props => (
                    <Form>
                        <label htmlFor="url">
                            url
                            <Field name="url" placeholder="required" />
                        </label>
                        <ErrorMessage name="url" component="p" />

                        { (error && !props.errors.url) ? <p>{error}</p> : null}

                        <button type='submit'>- get video -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default URLForm;