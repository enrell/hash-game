const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      message: '',
      socket: null,
      game: null,
      playerName: null,
      myTurn: null,
      gameVerify: false,
      turn: null,
    }
  },
  mounted() {
    this.socket = io.connect(window.location.origin);
    const self = this;

    this.socket.on("game.start", function(data) {

      self.game = data;
      let myPlayer = data._player1._socketID;
        
      if (myPlayer == self.socket.id) {
        myPlayer = data._player1;
      }else {
        myPlayer = data._player2;
      }
      self.turn = myPlayer._turn;
      self.myTurn = data._turn == self.turn;
      self.messageAlert();
    });

    this.socket.on("play", (data) => {
      self.game = data;
      self.myTurn = data._turn == self.turn;
      messageAlert();
    });
    
    this.socket.on("player.exit", function() {
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
      myTurn: this.myTurn
      });
    },
    plays(squares) {
      if (!this.myTurn || squares.turn != null){
        return;
      }else {
        this.socket.emit("make.play", {
          turn: this.turn,
          index: this.game._board._squares.indexOf(squares),
        });
      }
    },
    messageAlert() {
      this.message = this.myTurn ? "Play!" : "Wait opponent!";
      }
  },
});app.mount("#app");
