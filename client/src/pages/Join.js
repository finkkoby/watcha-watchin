import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

function Join() {

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
                onSubmit={values => console.log(values)}
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