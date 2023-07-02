import React, { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useAuth } from '../contexts/AuthProvider'

export default function Chat({ roomId }) {
    const socket = useSocket()
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([])

    const auth = useAuth()

    const sendMessage = () => {
        socket.emit('send_message', ({
            sender: auth.username, 
            body: message, 
            receiver: roomId
        }))
        appendMessage({ sender: "You", body: message})
        setMessage('')    
    }

    const appendMessage = (newMessage) => {
        setChatHistory(chatHistory => [...chatHistory, newMessage])
    }

    useEffect(() => {        
        socket.on('receive_message', appendMessage)

        return () => {

        }
    }, [])


    return (
        <>
            <div>
                {chatHistory.map((message) => (
                    <>
                    <b>{message.sender}</b>: <>{message.body}</>
                    </>
                ))}
            </div>
            <input value={message} onChange={e => setMessage(e.target.value)}/>
            <button onClick={sendMessage}>Send</button>
        </>
    )
}
