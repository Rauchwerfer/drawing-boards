const { randomUUID } = require('crypto');
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "*"
  }
});

io.engine.generateId = (req) => {
  return randomUUID()
}

app.use(express.static('build'));

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

io.on("connection", async (socket) => {
    socket.on("request_new_room", (arg) => {
      const roomId = randomUUID()
      socket.join(roomId)
      socket.emit('placed_to_room', roomId)
    });

    socket.on("request_join_room", (roomId) => {
      if (io.sockets.adapter.rooms.get(roomId) !== undefined) {
        socket.join(roomId)
        socket.emit('placed_to_room', roomId)
      }      
    });

    socket.on("request_leave_room", (roomId) => {      
      socket.leave(roomId)
      socket.emit('pulled_from_room')
    });

    // chat
    socket.on("send_message", (message) => {      
      socket.to(message.receiver).emit('receive_message', ({ sender: message.sender, body: message.body}));
    });

    // drawing
    socket.on('sending_paths', (req) => {
      io.to(req.roomId).emit('recieve_paths', req.pathData)
    })
})

const PORT = process.env.PORT || 5000;
console.log('server started on port:',PORT);
httpServer.listen(PORT);