const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      message: 'Hello',
      socket: null,
      game: null,
      playerName: null,
      myTurn: null,
      gameVerify: false,
      turn: null,

    }
  },
  methods: {
    start() {
      this.message = "Wait oponnent";
      this.gameVerify = true;
      this.socket.emit("game.start", {
      playerName: this.playerName,
      });
    },
    messageAlert() {
      this.message = this.myTurn;

      if(this.message == this.myTurn){
        console.log("Play!");
      }else{
        console.log("Wait oponnent play!");
      }
    },
  },
  mounted(){
    this.socket = io.connect(window.location.origin);
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
  },
});app.mount("#app");
