import { useEffect, useRef, useState } from "react";
import { useSocket } from "./contexts/SocketProvider";
import Room from "./components/Room";
import { useAuth } from "./contexts/AuthProvider";

function App() {
  const socket = useSocket()
  const auth = useAuth()
  const [roomId, setRoomId] = useState('')

  const roomIdInputRef = useRef()


  const createRoom = () => {
    socket.emit('request_new_room')
  }

  const joinRoom = () => {
    socket.emit('request_join_room', roomIdInputRef.current.value)
  }

  useEffect(() => {
    socket.on('placed_to_room', (id) => {
      setRoomId(id)
    })

    socket.on('pulled_from_room', () => {
      setRoomId('')
    })



    return () => {

    }
  }, [])


  return (
    <>
      <h1>Online Drawer</h1>


      {roomId === '' ?
        (
          <>
            <>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" value={auth.username} onChange={e => auth.setUsername(e.target.value)} />
            </>

            <>
              <>
                <label htmlFor="roomId">Join room:</label>
                <input type="text" id="roomId" ref={roomIdInputRef} />
              </>

              <button onClick={joinRoom}>Join room</button>
            </>

            <button onClick={createRoom}>Create room</button>
          </>
        )
        :
        (
          <Room roomId={roomId} />
        )
      }


    </>
  );
}

export default App;
