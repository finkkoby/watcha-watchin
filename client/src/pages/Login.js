import { useContext, useState, useEffect } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function Login() {
    const [error, setError] = useState(false)
    const { user, setUser, navigate, socket } = useContext(AppContext)

    if (user) {
        navigate('/user')
    }

    useEffect(() => {
        return () => setError(false)
    }, [])

    const formSchema = yup.object().shape({
        username: yup.string()
           .required('please enter a username'),
        password: yup.string()
           .required('please enter a password')
    })

    return (
        <div className="form-container">
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: values.username,
                            password:  values.password
                        })
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(user => {
                                setUser(user)
                                navigate('/user')
                            })
                        } else {
                            r.json().then(res => {
                                setError(res)
                            })
                        }
                    })
                }}
            >
                {props => (
                    <Form>
                        <label htmlFor="username">
                            username
                            <Field name="username" placeholder="watchin123" />
                        </label>
                        <ErrorMessage name="username" component="p" />
                        
                        <label htmlFor='password'>
                            password
                            <Field name="password" placeholder="********" />
                        </label>
                        <ErrorMessage name="password" component="p" />

                        {error ? <p>invalid username or password</p> : null}

                        <button type='submit'>- login -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login;