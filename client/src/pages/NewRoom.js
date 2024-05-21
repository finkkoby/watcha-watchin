import { useContext, useEffect, useState } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function NewRoom() {
    const [error, setError] = useState(false)

    const { user, setUser, setRoom, navigate, setJoin } = useContext(AppContext)

    useEffect(() => {
        return () => {
            setError(false)
        }
    }, [])

    const formSchema = yup.object().shape({
        name: yup.string().required("please enter a room name")
    })

    return (
        <div className='form-container page-body'>
            <Formik
                initialValues={{
                    name: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    fetch('/api/rooms/new', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: values.name
                        })
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(res => {
                                setRoom(res.room)
                                setJoin(res)
                                user['rooms'].push(res.room)
                                user['joins'].push(res)
                                setUser(user)
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
                        <label htmlFor="name">
                            name
                            <Field name="name" placeholder="required" />
                        </label>
                        <ErrorMessage name="name" component="p" />
                        { error ? <p>{error}</p> : null}
                        <button type='submit'>- create room -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewRoom;