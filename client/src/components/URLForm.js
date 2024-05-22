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

    function handleNewVideo(youtubeId) {
        fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                youtube_id: youtubeId
            })
        }).then(r => {
            if (r.ok) {
                r.json().then(res => {
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
                        handleNewVideo(youtubeId)
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