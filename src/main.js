import "./assets/main.css";
import { createApp } from "vue";
import express from "express";
import http from "http";
const server = http.createServer(expressApp);

import Server from "socket.io";
const io = new Server(server);

import uuid from "uuid";
import Player from "./model/Player";
import Game from "./model/Game";

const expressApp = createApp({
  data() {
    return {
      message: "",
      socket: null,
      game: null,
      playerName: null,
      myTurn: null,
      gameVerify: false,
      turn: null,
    };
  },
  mounted() {
    this.socket = io.connect(window.location.origin);
    const self = this;
    this.socket.on("game.start", (data) => {
      self.game = data;
      let myPlayer = data._player1._socketID;
      if (myPlayer == self.socket.id) {
        myPlayer = data._player1;
      } else {
        myPlayer = data._player2;
      }
      self.turn = myPlayer._turn;
      self.myTurn = data._turn == self.turn;
      self.messageAlert();
    });
    this.socket.on("play", (data) => {
      self.game = data;
      self.myTurn = data._turn == self.turn;
      self.messageAlert();
    });
    this.socket.on("player.exit", () => {
      self.message = "Opponent exit";
      self.game = null;
      self.gameVerify = false;
    });
  },
  methods: {
    start() {
      this.message = "Wait oponnent";
      this.gameVerify = true;
      this.socket.emit("game.start", {
        playerName: this.playerName,
        myTurn: this.myTurn,
      });
    },
    plays(squares) {
      if (!this.myTurn || squares.turn != null) {
        return;
      } else {
        this.socket.emit("make.play", {
          turn: this.turn,
          index: this.game._board._squares.indexOf(squares),
        });
      }
    },
    messageAlert() {
      this.message = this.myTurn ? "Play!" : "Wait opponent!";
    },
  },
});
expressApp.mount("#app");

// Server

// -----------------------------
// Express server

expressApp.get("/", (req, res) => {
  res.render("game");
});

expressApp.set("view engine", "ejs");
expressApp.set("views", "./views");

expressApp.use(express.static("../public"));
expressApp.use("/vendor", express.static("./../node_modules"));

// eslint-disable-next-line no-undef
expressApp.use("/hash-game", express.static(__dirname + "/views"));

server.listen(3000, () => {
  console.log("listening on *:3000");
});

// Socket.io
const clients = {};
const games = {};
let matchs = null;

io.on("connection", (socket) => {
  const id = socket.id;
  console.log("user ", "connected", id);
  clients[id] = socket;

  socket.on("game.start", function (data) {
    const game = join(socket, data);
    if (game.player2) {
      console.log("Game Start! ", game);
      // Emit event for client
      clients[game.player1.socketID].emit("game.start", game);
      clients[game.player2.socketID].emit("game.start", game);
    }
  });

  socket.on("make.play", function (data) {
    const game = games[socket.id];
    console.log("Turns: ", "TURN: ", data.turn, "Index: ", data.index);

    game.board.setSquares(data.index, data.turn);

    game.checkWinLose(data.index, data.turn);

    game.turnChange();

    const action = "play";
    clients[game.player1.socketID].emit(action, game);
    clients[game.player2.socketID].emit(action, game);
  });

  socket.on("disconnect", function () {
    console.log("user ", "disconected", id);
    const game = games[socket.id];

    if (game) {
      const socketEmit =
        game.player1.socketID == socket.id
          ? clients[game.player2.socketID]
          : clients[game.player1.socketID];
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

  if (matchs) {
    // if player1 is waiting, assign the player2 and set matchs to games object
    matchs.player2 = player;
    games[matchs.player1.socketID] = matchs;
    games[matchs.player2.socketID] = matchs;
    matchs = null;
    return games[socket.id];
  } else {
    // eslint-disable-next-line no-undef
    s;
    matchs = new Game(player); // else, create new game with constant player1
    return matchs;
  }
};

io.engine.generateId = () => {
  return uuid.v4();
};

io.engine.on("connection_error", (err) => {
  //console.log(err.req);    // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
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
