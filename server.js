const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cookie: true
});
const uuid = require("uuid");

// Set Cookies

// const cookies = { serialize, parse} ;

// io.engine.on("initial_headers", (headers, request) => {
//   headers["set-cookie"] = serialize("uid", "1234", { sameSite: "strict" });
// });

// io.engine.on("headers", (headers, request) => {
//   if (!request.headers.cookie) return;
//   const cookies = parse(request.headers.cookie);
//   if (!cookies.randomId) {
//     headers["set-cookie"] = serialize("randomId", "abc", { maxAge: 86400 });
//   }
// });

// Socket

io.engine.generateId = (req) => {
  return uuid.v4();
}

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

io.on('connection', (socket) => {
  console.log('user: ', socket.id);
  console.log('rooms: ', socket.rooms);
  console.log('data: ', socket.data);

  socket.on('disconnect', () => {
    console.log('user ', 'disconected', socket.id);
  });
});

// Messages //

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });


// -----------------------------
// Express server

app.get('/', (req, res) => {
  res.render('game');
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.use('/hash-game', express.static(__dirname + '/views'));

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// Database connection
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'enrell',
  password: '',
  database: 'hashgame'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  //console.log('mysql connected as id ' + connection.threadId);
});

connection.end();
