const path = require("path");
const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const io = new Server(server);
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected',socket);
});

server.listen(3002, () => {
  console.log('server running at http://localhost:3002');
});