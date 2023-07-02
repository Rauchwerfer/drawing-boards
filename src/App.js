import { useEffect, useRef, useState } from "react";
import { useSocket } from "./contexts/SocketProvider";
import Room from "./components/Room";
import { useAuth } from "./contexts/AuthProvider";
import { Button, Container, Form } from "react-bootstrap";

function App() {
  const socket = useSocket()
  const auth = useAuth()
  const [roomId, setRoomId] = useState('')

  const roomIdInputRef = useRef()


  const createRoom = () => {
    socket.emit('request_new_room')
  }

  const joinRoom = () => {
    socket.emit('request_join_room', {
      roomId: roomIdInputRef.current.value
    })
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
    <Container>
      <div className="">
        <h1>Drawing Boards</h1>

        {roomId === '' ?
          (
            <div>
              <div>
                <h3>Choose a name</h3>
                <Form.Control
                  placeholder="Username"
                  type="text"
                  id="username" 
                  value={auth.username} 
                  onChange={e => auth.setUsername(e.target.value)}
                />
                <Button onClick={auth.generatePockemonName}>Regenerate</Button>
              </div>

              <div>
                <>
                <h3>Join existing room...</h3>
                  <Form.Control
                    placeholder="Type Room Id..."
                    type="text"
                    id="roomId"
                    ref={roomIdInputRef}
                  />
                </>
                
                <Button onClick={joinRoom}>Join room</Button>
              </div>
              <h3>...or create new one</h3>
              <Button onClick={createRoom}>Create room</Button>
            </div>
          )
          :
          (
            <Room roomId={roomId} />
          )
        }
      </div>



    </Container>
  );
}

export default App;
