import { useContext, useEffect, useState } from 'react'

import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import AppContext from '../context/AppContext'

function URLForm() {
    const [error, setError] = useState(false)
    
    const formSchema = yup.object().shape({
        url: yup.string().required("please enter a valid youtube URL")
    })

    return (
        <div className='form-container page-body'>
            <Formik
                initialValues={{
                    url: ''
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                    
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