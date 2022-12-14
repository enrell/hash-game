const Board = require( "./Board");

class Game {
  constructor(player1) {
    this._player1 = player1;
    this._player2 = null;
    this._board = new Board();
    this._winner = null;
    this._gameover = null;
    this._turn = "x";
  }
  get player1() {
    return this._player1;
  }
  get player2() {
    return this._player2;
  }
  get board() {
    return this._board;
  }
  getGameover() {
    return this._gameover;
  }
  set player2(player2) {
    player2._turn = "o";
    this._player2 = player2;
  }
  checkWinLose(i, t) {
    this._board._squares[i].turn = t;
      if (this._board._squares[0].turn == "x" && this._board._squares[1].turn == "x" && this._board._squares[2].turn == "x" ||
       this._board._squares[0].turn == "o" && this._board._squares[1].turn == "o" && this._board._squares[2].turn == "o") {

        console.log("Player " + this._board._squares[i].turn + " win");

      }
      if (this._board._squares[3].turn == "x" && this._board._squares[4].turn == "x" && this._board._squares[5].turn == "x"
      || this._board._squares[3].turn == "o" && this._board._squares[4].turn == "o" && this._board._squares[5].turn == "o") {

        console.log("Player " + this._board._squares[i].turn + " win");
      }
      if (this._board._squares[6].turn == "x" && this._board._squares[7].turn == "x" && this._board._squares[8].turn == "x"
      || this._board._squares[6].turn == "o" && this._board._squares[7].turn == "o" && this._board._squares[8].turn == "o") {

        console.log("Player " + this._board._squares[i].turn + " win");
      }
      
  }
  turnChange() {
    if (this._turn == "x") {
      this._turn = "o";
    }else {
      this._turn = "x"
    }
  }
  
}
module.exports = Game;
