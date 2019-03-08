export default class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(room, text) {
    this.socket.emit("message", {
      room,
      text
    });
  }

  changeRoom(room) {
    this.socket.emit("join", {
      room
    });
  }

  processCommand(command) {
    let match = /^\/(\w+)\s+(.*)$/.exec(command);
    let _command = "",
      val = "";
    if (match) {
      _command = match[1];
      val = match[2].trim();
    }

    switch (_command) {
      case "join":
        this.changeRoom(val);
        break;
      case "nick":
        this.socket.emit("changeNickName", val);
        break;
      default:
        console.log();
        break;
    }
  }
}

