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

io.on('connection', client => {
  console.log('123');
  client.on('event', data => {

  });

  client.on('disconnect', () => {
    
  });
})

server.listen(9001, function() {
  console.log(`server listen on port ${9001}`);
});
