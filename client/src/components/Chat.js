import { useContext, useEffect, useState } from 'react';

import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import '../css/Chat.css';
import AppContext from '../context/AppContext'

import Message from './Message';

function Chat({ socket }) {
    const { user, room } = useContext(AppContext);

    const date = new Date()
    const time = date.toLocaleString('hc', {
        timeStyle: 'short'
    })

    const welcomeMessage = {
        message: `Welcome to WHATCHA' WATCHIN'!!!`,
        username: 'admin',
        time: time
    }

    const [messages, setMessages] = useState([welcomeMessage])
    console.log(messages)
    useEffect(() => {
        if (socket) {
            socket.on('newmessage', data => {
                handleNewMessage(data)
            })
        }
    }, [socket, messages])

    const formSchema = yup.object().shape({
        message: yup.string()
    })

    function handleNewMessage(message) {
        setMessages([...messages, message])
    }

    const messageCards = messages.map((m, i) => {
        return (
            <Message message={m} key={i} user={user}/>
        )
    })

    return (
        <div id='chat-container'>
            <div id='chat-header'>
                <h2>chat</h2>
            </div>
            <div id='message-box'>
                { messageCards }
            </div>
            <div id='message-field'>
                <Formik 
                    initialValues={{
                        message: ''
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, { resetForm }) => {
                        const date = new Date()
                        const time = date.toLocaleString('hc', {timeStyle: 'short'})
                        socket.emit('sendmessage', {
                            message: values.message,
                            username: user.username,
                            time: time,
                            name: room.name
                        })
                        resetForm()
                    }}
                >
                    <Form>
                        <Field name="message" />
                        <button type='submit'>send</button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default Chat;