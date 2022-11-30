class Board {
  constructor(){
    this._squares = [
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null },
      { turn: null }
    ];
  }
  get squares(){
    return this._squares;
  }
  getSquares(i){
    return this._squares(i);
  }
  setSquares(i, turn){
    this._squares[i].turn = turn; // Store turn in square[index]
  }
  reset(){
    this._squares.forEach((squares) => (squares.turn = null));
  }
}
