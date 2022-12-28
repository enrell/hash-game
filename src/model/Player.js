class Player {
  constructor(name, turn, socketID) {
    this._name = name;
    this._turn = turn;
    this._socketID = socketID;
  }
  get name() {
    return this._name;
  }
  get turn() {
    return this._turn;
  }
  get socketID() {
    return this._socketID;
  }
  set turn(turn) {
    this._turn = turn;
  }
}

export default Player;
