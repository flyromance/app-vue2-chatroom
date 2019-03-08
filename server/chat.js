let nickNames = {};

// 分配用户昵称
function assignNickName(socket, guestNumber, nickNames, usedNames) {
  var name = "Guest" + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('changeNickNameResult', {
    success: true,
    name: name,
  });

  usedNames.push(name);
  return guestNumber + 1;
}

// 加入聊天室
function joinroom(socket, room) {
  socket.join(room);
  current
}

// 修改名字
function handleNickNameChange(socket, nickNames, usedNames) {
  socket.on("changeNickName", function(name) {
    if (name.indexOf("Guest") === 0) {
      socket.emit("changeNickNameResult", {
        success: false,
        message: "names connot begin with Guest"
      });
    } else {
      if (usedNames.indexOf(name) === -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = usedNames.indexOf(previousName);
        usedNames.push(name);
        usedNames.splice(previousNameIndex, 1);
        nickNames[socket.id] = name;
      } else {
        socket.emit("changeNickNameResult", {
          success: false,
          meessage: "that name is already in use."
        });
      }
    }
  });
}

// 发送信息
function handleMessageBroadcasting(socket) {
  socket.on("message", function(message) {
    socket.broadcast.to(message.room).emit("message", {
      text: nickNames[socket.id] + ": " + message.text
    });
  });
}

// 创建房间
function handle() {}
