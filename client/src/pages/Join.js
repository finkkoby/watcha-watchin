import { useContext, useEffect, useState } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function Join() {
    const [error, setError] = useState(false)

    const { setRoom, navigate, setUser, setJoin } = useContext(AppContext)

    useEffect(() => {
        return () => {
          setError(false)
        }
      }, [])

    const formSchema = yup.object().shape({
        name: yup.string().required('please enter a name'),
        roomCode: yup.string().required('please enter a room code'),
    })


    return (
        <div className='form-container'>
            <Formik
                initialValues={{
                    name: '',
                    roomCode: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    fetch('/api/rooms/guest_join', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: values.name,
                            roomCode: values.roomCode
                        })
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(res => {
                                setUser(res['user'])
                                setRoom(res['room'])
                                setJoin(res['join'])
                                navigate(`/guest/room/${res.room.id}`)
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
                        <label htmlFor="name">
                            name
                            <Field name="name" placeholder="required" />
                        </label>
                        <ErrorMessage name="name" component="p" />

                        <label htmlFor="roomCode">
                            room code
                            <Field name="roomCode" placeholder="required" />
                        </label>
                        <ErrorMessage name="roomCode" component="p" />

                        { error && !props.errors.name && !props.errors.roomCode ? <p>{error}</p> : null}

                        <button type='submit'>- join room -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Join;