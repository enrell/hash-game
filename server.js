const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/hash-game', express.static(__dirname + '/public'));

server.listen(3000, () => {
  console.log('listening on *:3000');
});


// Socket

io.on('connection', (socket) => {
  //console.log('a user connected');
  socket.on('disconnect', () => {
    //console.log('user disconnected');
  });
});

