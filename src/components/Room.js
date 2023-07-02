import React, { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import Chat from './Chat'
import DrawingBoard from './DrawingBoard'

export default function Room({ roomId }) {    
    const socket = useSocket()

    const leave = () => {
        socket.emit('request_leave_room', roomId)
    }
    
    useEffect(() => {
        socket.emit('joining_room', {
            roomId: roomId
        })

        return () => {
            socket.emit('leaving_room', {
                roomId: roomId
            })
        }
    }, [])

    return (
        <>
        <h3>Room {roomId}</h3>
        <button onClick={leave}>Leave</button>
        <Chat roomId={roomId} />
        <DrawingBoard roomId={roomId} />
        </>
    )
}
