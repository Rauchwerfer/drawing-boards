import React, { useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import Chat from './Chat'
import DrawingBoard from './DrawingBoard'
import { Button } from 'react-bootstrap'

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
        <div>
            <div className='d-flex justify-content-between'>
                <h3>Room Id: {roomId}</h3>
                <Button variant='secondary' onClick={leave}>Leave</Button>
            </div>
            <div className='row'>
                <div className='col-9'>
                    <DrawingBoard roomId={roomId} />
                </div>
                <div className='col-3'>
                    <Chat roomId={roomId} />
                </div>
            </div>


        </div>
    )
}
