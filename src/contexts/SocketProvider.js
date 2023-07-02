import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState()

  useEffect(() => {
    console.log('Starting socket...')
    const newSocket = io({
      autoConnect: false
    })
    
    newSocket.on('connect', () => {
      console.log('Connected with ID ' + newSocket.id)
      setSocket(newSocket)
    })
    newSocket.on("disconnect", (reason) => {
      console.log(reason)
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        //socket.connect()
      }
    })
    newSocket.on("connect_error", (error) => {
      console.log(error)
    })
    newSocket.connect()
    
    return () => newSocket.close()
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {socket !== undefined && socket.connected ?
        children 
      :
        <h3>Loading socket...</h3>
      }
    </SocketContext.Provider>     
  )
}