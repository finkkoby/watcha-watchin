import { useContext, useState, useEffect } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function Signup() {
    const [error, setError] = useState(false)
    const { setUser, navigate } = useContext(AppContext)

    useEffect(() => {
        return () => {
          setError(false)
        }
      }, [])
    
    const formSchema = yup.object().shape({
        firstName: yup.string().required("please enter your first name"),
        lastName: yup.string().required("please enter your last name"),
        username: yup.string().required("please enter a username"),
        email: yup.string().required("please enter an email").email("please enter a valid email"),
        password: yup.string().required("please enter a password"),
        confirmPassword: yup.string().required("please confirm your password").oneOf([yup.ref('password'), null], "passwords do not match"),
        age: yup.number().required("please enter your age").min(18, "you must be at least 18 years old to register")
    })

    return (
        <div className="form-container">
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    age: '',
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    fetch('/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            username: values.username,
                            email: values.email,
                            password:  values.password,
                            confirmPassword: values.confirmPassword,
                            age: values.age,
                        })
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(user => {
                                setUser(user)
                                navigate('/user')
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
                        <label htmlFor="firstName">
                            enter your first name
                            <Field name="firstName" placeholder="required" />
                        </label>
                        <ErrorMessage name="firstName" component="p" />
                        
                        <label htmlFor="lastName">
                            enter your last name
                            <Field name="lastName" placeholder="required" />
                        </label>
                        <ErrorMessage name="lastName" component="p" />

                        <label htmlFor="username">
                            create a username
                            <Field name="username" placeholder="required" />
                        </label>
                        <ErrorMessage name="username" component="p" />

                        <label htmlFor='email'>
                            enter your email
                            <Field name="email" placeholder="required" />
                        </label>
                        <ErrorMessage name="email" component="p" />
                        
                        <label htmlFor='password'>
                            create password
                            <Field name="password" placeholder="required" />
                        </label>
                        <ErrorMessage name="password" component="p" />

                        <label htmlFor='confirmPassword'>
                            confirm password
                            <Field name="confirmPassword" placeholder="required" />
                        </label>
                        <ErrorMessage name="confirmPassword" component="p" />

                        <label htmlFor='age'>
                            enter your age
                            <Field name="age" placeholder="required" />
                        </label>
                        <ErrorMessage name="age" component="p" />

                        {error && (
                            !props.errors.username &&
                            !props.errors.email &&
                            !props.errors.firstName &&
                            !props.errors.lastName &&
                            !props.errors.password && 
                            !props.errors.confirmPassword &&
                            !props.errors.age
                            ) ? <p>{error}</p> : null}

                        <button type='submit'>- signup -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Signup;