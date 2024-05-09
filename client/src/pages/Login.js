import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

function Login() {

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
                            r.json().then(data => {
                                console.log(data)
                            })
                        } else {
                            console.log(r)
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

                        <button type='submit'>- login -</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login;