import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useAuth } from '../contexts/AuthProvider'
import { Button, Form } from 'react-bootstrap'

export default function Chat({ roomId }) {
    const socket = useSocket()
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([])

    const auth = useAuth()

    const messagesEndRef = useRef()

    const sendMessage = () => {
        socket.emit('send_message', ({
            sender: auth.username,
            body: message,
            receiver: roomId
        }))
        appendMessage({ sender: "You", body: message })
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

    useEffect(() => {
        const scrollToBottom = () => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        scrollToBottom()
      }, [chatHistory])

    return (
        <div className='h-100 d-flex flex-column p-2' >
            <div className='border border-1'>
<p>Participants</p>
            </div>
            <div className="overflow-y-scroll flex-grow-1 border border-1 p-2" style={{ maxHeight: '400px'}}>
                {chatHistory.map((message) => (
                    <p>
                        <b>{message.sender}</b>: <>{message.body}</>
                    </p>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='input-group border border-1 p-2'>
                <Form.Control
                    placeholder="Type Message..."
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={64}
                />
                <Button onClick={sendMessage}>Send</Button>
            </div>

        </div>
    )
}
