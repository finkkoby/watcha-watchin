

function Message({ message, user }) {

    const sentMessage = (
        <div className='sent message'>
            <h4>{message.username}</h4>
            <p>{message.message}</p>
            <small>{message.time}</small>
        </div>
    )

    const receievedMessage = (
        <div className='receieved message'>
            <h4>{message.username}</h4>
            <p>{message.message}</p>
            <small>{message.time}</small>
        </div>
    )
    return (
        <>
            { message.username === user.username ? sentMessage : receievedMessage }
        </>
    )
}

export default Message;