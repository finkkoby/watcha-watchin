import { useContext } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function Join() {

    const { setRoom, navigate } = useContext(AppContext)

    const formSchema = yup.object().shape({
        name: yup.string().required(),
        roomCode: yup.string().required()
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
                                setRoom(res.room)
                                navigate(`/guest/room/${res.room.id}`)
                            })
                        } else {
                            r.json().then(res => {
                                console.log(res.message)
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

                        <button type='submit'>- join room -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Join;