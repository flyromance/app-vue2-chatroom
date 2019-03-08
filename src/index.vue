<template>
  <div id="container">
    <div class="room-header">hi {{userName}}, welcome to room {{roomName}}</div>
    <div class="room-content">
      <div class="room-window">
        <div v-for="(item, index) in messageList" :key="index">{{item}}</div>
      </div>
      <div class="room-list">
        <div v-for="(item) in roomList" :key="item.id">{{item.name}}</div>
      </div>
    </div>
    <div class="room-footer">
      <div class="room-form">
        <input class="message-input" type="text" v-model="message">
        <button class="message-btn" v-on:click="handleSend">send</button>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "./lib/chat.js";
import io from "socket.io-client";

export default {
  props: {},
  data() {
    return {
      userName: "",
      roomName: "",
      messageList: [],
      message: "",
      roomList: []
    };
  },
  computed: {},
  methods: {
    handleSend() {
      if (this.message.indexOf("/") === 0) {
        this._chat.processCommand(this.message);
      } else {
        if (!this.roomName) {
          alert("先加入或者创建聊天室");
        } else {
          this._chat.sendMessage(this.roomName, this.message);
        }
      }
    }
  },
  mounted() {
    const socket = io.connect();
    let chat = null;

    socket.on("connect", () => {
      console.log("connect");
      this._chat = chat = new Chat(socket);
    });

    socket.on("joinResult", data => {
      console.log(data);
    });

    socket.on("message", data => {
      console.log(data);
      this.messageList.push(data.text);
    });

    socket.on("changeNickNameResult", data => {
      if (data.success) {
        this.userName = data.name;
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  },
  unmounted() {}
};
</script>

<style>
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
#container {
  padding: 20px;
}
.room-header {
  margin-bottom: 20px;
}
.room-content {
  display: flex;
}
.room-window {
  flex-grow: 1;
  height: 300px;
  overflow: auto;
  border: 1px solid #ccc;
}
.room-list {
  flex-basis: auto;
  width: 300px;
  margin-left: 20px;
  border: 1px solid #ddd;
}

.room-footer {
  margin-top: 20px;
}

.message-input {
  width: 200px;
  outline: none;
}
</style>
