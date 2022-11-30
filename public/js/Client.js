this.socket = io.connect(window.location.origin);

const socket = null;
const game = null;
const playerName = null;
const myTurn = null;
const gameVerify = false;
const turn = null;
const message = "";

function start(){
  this.message = "Wait oponnent";
  this.gameVerify = true;
  this.socket.emit("game.start", {
  playerName: this.playerName,
  });
}
function messageAlert(){
  this.message = this.myTurn;

  if(this.message == this.myTurn){
    console.log("Play!");
  }else{
    console.log("Wait oponnent play!");
  }
}
const bckp = this;

this.socket.on("game.start", function(data){
  bckp.game = data;
  const myPlayer = data._player1._socketID;

  if (bckp.data.socket.id == myPlayer){
    myPlayer = data._player1;
  }else {
    myPlayer = data._player2;
  }
  bckp.turn = myPlayer._turn;
  bckp.myTurn = data._turnOf == bckp.turn;
});

// const squares = Array.from(document.querySelectorAll('.square'));

// for (var i = 0; i < squares.length; i++) {
//     squares[i].onclick = function(e){
//         const x = '<img class="x" src="x.svg">';
//         const o = '<img class="o" src="circle.svg">';

//         if (turn == 0) {
//           e.target.innerHTML = x;
//         }
//         if (turn == 1) {
//           e.target.innerHTML = o;
//         } 
//     }
// }
