const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const socketio = require("socket.io");

function send404(res) {
  res.writeHead(404, {
    "Content-Type": "text/plain"
  });
  res.write("Error 404: resource not found.");
  res.end();
}

function sendFile(res, filePath, fileContent) {
  res.writeHead(200, {
    "Content-Type": mime.getType(filePath)
  });
  res.end(fileContent);
}

function serverStatic(res, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(res);
        } else {
          sendFile(res, absPath, data);
        }
      });
    } else {
      // send404(res);
    }
  });
}

const baseDir = process.cwd();
const staticDir = path.join(baseDir, "static");

const server = http.createServer(function(req, res) {
  let filepath = path.join(staticDir, req.url);
  serverStatic(res, filepath);
});

const io = socketio(server);

const USED_NAMES = [];
const NICK_NAMES = {};
let guestNumber = 0;
const CURRENT_ROOM = {};
const ROOMS = [];

// 分配用户昵称
function assignNickName(socket, guestNumber, nickNames, usedNames) {
  var name = "Guest" + guestNumber;
  nickNames[socket.id] = name;
  socket.emit("changeNickNameResult", {
    success: true,
    name: name
  });

  usedNames.push(name);
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

io.on("connection", socket => {
  console.log("connect");

  // 分配名字
  assignNickName(socket, guestNumber++, NICK_NAMES, USED_NAMES);

  // 接受client消息后，广播给同一个聊天室的socket，除了自身之外
  socket.on("message", function(message) {
    socket.broadcast.to(message.room).emit("message", {
      text: NICK_NAMES[socket.id] + ": " + message.text
    });
  });

  // 加入聊天室
  socket.on("join", function({ room }) {
    // 房间不存在, 则创建房间，并且进入
    if (ROOMS.indexOf(room) === -1) {
      ROOMS.push(room);
      CURRENT_ROOM[socket.id] = room;
      socket.join(room);
    } else {
      // 先离开旧的
      if (CURRENT_ROOM[socket.id] && CURRENT_ROOM[socket.id] !== room) {
        socket.leave(CURRENT_ROOM[socket.id]);
        CURRENT_ROOM[socket.id] = room;
        socket.join(room);
      } else {
        return;
      }
    }

    // console.log(socket.adapter.rooms);

    // socket.broadcast.emit(); 向除了自己的所有client发送
    // io.sockets.emit(); 向所有连接发送
    socket.emit("joinResult", {
      success: true,
      room: room
    });

    // socket.to(room)给这个聊天室的其他socket连接发送消息
    // io.to(room) 给在这个room的所有socket发送
    socket.to(room).emit("message", {
      text: NICK_NAMES[socket.id] + " has joined " + room + "."
    });

    // let usersInRoom = io.sockets.clients(room);
    // if (usersInRoom.length > 1) {
    //   let usersInroomsSummary = "users currently in " + room + ": ";
    //   usersInRoom.reduce(function(a, b) {
    //     if (b.id !== socket.id) {
    //       usersInroomsSummary = a + " " + NICK_NAMES[b.id];
    //     }
    //     return usersInroomsSummary;
    //   }, usersInroomsSummary);
    //   socket.emit("message", {
    //     text: usersInroomsSummary
    //   });
    // }
  });

  // 断开连接时
  socket.on("disconnect", () => {
    var nameIndex = USED_NAMES.indexOf(NICK_NAMES[socket.id]);
    USED_NAMES.splice(nameIndex, 1);
    delete NICK_NAMES[socket.id];
  });
});

server.listen(9001, function() {
  console.log(`server listen on port ${9001}`);
});
