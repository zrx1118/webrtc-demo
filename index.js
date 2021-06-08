var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var options = {
    key: fs.readFileSync('cert/www.slighthub.com.key'), 
    cert: fs.readFileSync('cert/www.slighthub.com.crt')
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
app.get('/room', (req, res) => {
    res.sendFile(__dirname + '/room.html')
})
app.get('/photo', (req, res) => {
    res.sendFile(__dirname + '/photo.html')
})
app.get('/datachannel', (req, res) => {
    res.sendFile(__dirname + '/datachannel.html')
})
app.get('/connect', (req, res) => {
    res.sendFile(__dirname + '/connect.html')
})
app.get('/conn', (req, res) => {
    res.sendFile(__dirname + '/conn.html')
})

app.get('/recordaudio', (req, res) => {
    res.sendFile(__dirname + '/recordaudio.html')
})

app.get('/recordvideo', (req, res) => {
    res.sendFile(__dirname + '/recordvideo.html')
})

app.get('/recordmedia', (req, res) => {
    res.sendFile(__dirname + '/recordmedia.html')
})
app.get('/screenrecord', (req, res) => {
    res.sendFile(__dirname + '/screenrecord.html')
})

app.get('/fly', (req, res) => {
    res.sendFile(__dirname + '/fly.html')
})

app.get('/from-chat', (req, res) => {
    res.sendFile(__dirname + '/from-chat.html')
})


io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);
    socket.join(socket.id);
    io.emit('connected', socket.id)
    
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
        socket.broadcast.emit('userdisconnect', socket.id)
    })

    socket.on('message', (room, data) => {
        socket.to(room).emit('message', room, data)
    })

    socket.on('join', (room) => {
        socket.join(room);
        // console.log('IO:',io);
        var users = socket.adapter.sids.size;
        if (users < 3) {
            socket.emit('joined', room, socket.id)
            if (users > 1) {
                io.to(room).emit('otherjoin', room, socket.id)
            }
        } else {
            socket.leave(room);
            socket.emit('full', room, socket.id)
        }
        // socket.to(room).emit('joined', room, socket.id); // 除自己之外
        // socket.in(room).emit('joined', room, socket.id); // 房间内所有人
        // socket.broadcast.emit('joined', room, socket.id); // 除自己，全部
    })

    socket.on('leave', (room) => {
        // var myRoom = io.sockets.adapter.rooms[room];
        // var users = Object.keys(myRoom.sockets).length
        // logger.log('the number of use out room is:' + users);
        socket.leave(room);
        io.to(room).emit('bye', room, socket.id)
        socket.emit('leaved', room, socket.id)
        // socket.to(room).emit('leaved', room, socket.id); // 除自己之外
        // socket.in(room).emit('leaved', room, socket.id); // 房间内所有人
        // socket.broadcast.emit('leaved', room, socket.id); // 除自己，全部
    })

    socket.on('newuser', data => {
        console.log(data);
        console.log(socket.id + 'new user ' + data.msg);
        socket.broadcast.emit('need', { sender: socket.id, msg: data.msg});
    })

    socket.on('ok', data => {
        console.log(socket.id + 'ok msg ' + data);
        io.to(data.receiver).emit('answerok', { sender: data.sender});
    })

    socket.on('sdp', data => {
        console.log('sdp');
        console.log(data.description);
        socket.to(data.to).emit('sdp', {
            description: data.description,
            sender: data.sender
        });
    })

    socket.on('icecandidate', data => {
        console.log('ice');
        console.log(data);
        socket.to(data.to).emit('icecandidate', {
            candidate: data.candidate,
            sender: data.sender
        });
    })
})
const os = require('os');
///////////////////获取本机ip///////////////////////
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    // console.log('interfaces',interfaces);
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const myHost = getIPAdress();

http.listen(8000, () => {
    console.log('Listening on port 8000');
})
console.log(https);
https.listen(8443, () => {
    console.log(`listening on port https://${myHost}:8443`);
})
