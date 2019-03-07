<template>
  <div id="container">
    <div class="room-header">{{'房间号'}}</div>
    <div class="room-content">
      <div class="room-window"></div>
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
import Chat from './lib/chat.js';
import io from 'socket.io-client';
const socket = io.connect();
const chat = new Chat(socket);

export default {
  props: {},
  data() {
    return {
      message: "",
      roomList: [
        {
          id: 12,
          name: "room1"
        }
      ]
    };
  },
  computed: {},
  methods: {
    handleSend() {
      if (message[0] === "/") {
        //
      } else {

      }
    }
  }
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
