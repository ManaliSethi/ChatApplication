const path = require("path");
const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('node:http');
const { addUser,getUsersInRoom} = require("../utils/users");
const { generateMessage } = require("../utils/messages");
const app = express();
const server = createServer(app);
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const io = new Server(server);
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    } else {
      socket.join(user.room);

      socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

      callback();
    }
  });
});

server.listen(3002, () => {
  console.log('server running at http://localhost:3002');
});