var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var options = {
    key: fs.readFileSync('pem/rsa_private_key.pem'),
    cert: fs.readFileSync('pem/cacert.pem')
};

var https = require('https').createServer(options, (req, res) => {
    app.handle(req, res)
});
var io = require('socket.io')(https);
var log4js = require('log4js');
log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
})

var logger = log4js.getLogger();

app.use(express.static(__dirname + '/static'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/camera', (req, res) => {
    res.sendFile(__dirname + '/camera.html')
})
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
})
app.get('/peer', (req, res) => {
    res.sendFile(__dirname + '/peer.html')
})


io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
    })

    socket.on('message', (userId, msg) => {
        console.log(socket.id + ' say ' + msg);
        io.emit('message', userId, msg)
    })

    socket.on('join', (room) => {
        socket.join(room);
        console.log(io);
        // var myRoom = io.sockets.adapter.rooms[room];
        // var users = Object.keys(myRoom.sockets).length;
        // logger.log('the number of use in room is:' + users);
        socket.emit('joined', room, socket.id)
        // socket.to(room).emit('joined', room, socket.id); // 除自己之外
        // socket.in(room).emit('joined', room, socket.id); // 房间内所有人
        // socket.broadcast.emit('joined', room, socket.id); // 除自己，全部
    })

    socket.on('leave', (room) => {
        // var myRoom = io.sockets.adapter.rooms[room];
        // var users = Object.keys(myRoom.sockets).length
        // logger.log('the number of use out room is:' + users);
        socket.leave(room);
        socket.emit('leaved', room, socket.id)
        // socket.to(room).emit('leaved', room, socket.id); // 除自己之外
        // socket.in(room).emit('leaved', room, socket.id); // 房间内所有人
        // socket.broadcast.emit('leaved', room, socket.id); // 除自己，全部
    })
})
http.listen(8080, () => {
    console.log('Listening on port 8080');
})
https.listen(443, () => {
    console.log('listening on port 443');
})
