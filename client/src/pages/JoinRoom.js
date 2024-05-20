import { useContext, useEffect, useState } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function JoinRoom() {
    const [error, setError] = useState(false)

    const { user, room, setRoom, navigate, handleUpdate } = useContext(AppContext)

    useEffect(() => {
        return () => setError(false)
    }, [])

    const formSchema = yup.object().shape({
        roomCode: yup.string().required("please enter a room code")
    })

    return (
        <div className='form-container page-body'>
            <Formik
                initialValues={{
                    roomCode: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    fetch('/api/rooms/join', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            roomCode: values.roomCode
                        })
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(res => {
                                const newUser = {...user, "room": res}
                                setRoom(res)
                                handleUpdate(newUser)
                                navigate(`/user/room/${res.id}`)
                            })
                        } else {
                            r.json().then(res => {
                                setError(res.message)
                            })
                        }
                    })
                }}
            >
                {props => (
                    <Form>
                        <label htmlFor="room-code">
                            room code
                            <Field name="roomCode" placeholder="required" />
                        </label>
                        <ErrorMessage name="roomCode" component="p" />

                        { error ? <p>{error}</p> : null}

                        <button type='submit'>- join room -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default JoinRoom;