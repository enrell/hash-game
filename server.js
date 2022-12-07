const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const uuid = require("uuid");
const Player = require("./src/model/Player");
const Game = require("./src/model/Game");
const Board = require("./src/model/Board");
// -----------------------------
// Express server

app.get('/', (req, res) => {
  res.render('game');
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use('/vendor', express.static('./node_modules'));

app.use('/hash-game', express.static(__dirname + '/views'));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// Socket.io
const clients = {};
const games = {};
let matchs = null;

io.on('connection', (socket) => {
  const id = socket.id;
  console.log('user ', 'connected', id);
  clients[id] = socket;

  socket.on("game.start", function(data) {
    const game = join(socket, data);
    if (game.player2) {
      console.log("Game Start! ", game);
      // Emit event for client
      clients[game.player1.socketID].emit("game.start", game);
      clients[game.player2.socketID].emit("game.start", game);
    }
  });

  socket.on("make.play", function(data) {
    const game = games[socket.id];
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","DATA TURN: ", data.turn,"DATA I: ", data.index);
    game.board.setSquares(data.index, data.turn);

    game.turnChange();
    
    const action = "play";
    clients[game.player1.socketID].emit(action, game);
    clients[game.player2.socketID].emit(action, game);

  });

  socket.on('disconnect', function() {
    console.log('user ', 'disconected', id);
    const game = games[socket.id];
    
    if (game) {
      const socketEmit = game.player1.socketID == socket.id ? clients[game.player2.socketID] : clients[game.player2.socketID];
      const exit = "player.exit";
      
      if (socketEmit) {
        socketEmit.emit(exit);
      }
      delete games[socket.id];
      delete games[socketEmit.id];
    }
    delete clients[id];
  });
});

const join = (socket, data) => {
  const player = new Player(data.playerName, "x", socket.id);
  console.log(player);

  if (matchs) { // if player1 is waiting, assign the player2 and set matchs to games object
    matchs.player2 = player;
    games[matchs.player1.socketID] = matchs;
    games[matchs.player2.socketID] = matchs;
    matchs = null;
    return games[socket.id];
  }else {
    matchs = new Game(player); // else, create new game with constant player1
    return matchs;
  }
}


io.engine.generateId = (req) => {
  return uuid.v4();
}

io.engine.on("connection_error", (err) => {
  //console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});





// // Database connection
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'enrell',
//   password: '',
//   database: 'hashgame'
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
 
//   //console.log('mysql connected as id ' + connection.threadId);
// });

// connection.end();
