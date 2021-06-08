var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var options = {
    key: fs.readFileSync('cert/www.slighthub.com.key'),
    cert: fs.readFileSync('cert/www.slighthub.com.crt')
};

var https = require('https').createServer(options, app);
var io = require('socket.io')(https);
app.use(express.static(__dirname + '/static'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/conn', (req, res) => {
    res.sendFile(__dirname + '/conn.html')
})


io.on('connection', (socket) => {
    socket.join(socket.id);
    console.log('a user connected: ' + socket.id);
    
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
        socket.broadcast.emit('userdisconnect', socket.id)
    })

    socket.on('message', (room, data) => {
        socket.broadcast.emit('message', room, data)
    })

    socket.on('new user greet', (data) => {
        console.log(data);
        socket.broadcast.emit('need connect', { sender: socket.id, msg: data.msg })
    })

    socket.on('ok we connect', data => {
        console.log(socket.id + ' ok msg ' + data);
        io.to(data.receiver).emit('ok we connect', { sender: data.sender});
    })

    socket.on('sdp', data => {
        console.log('sdp', data);
        socket.to(data.to).emit('sdp data', {
            description: data.description,
            sender: data.sender
        });
    })

    socket.on('ice candidates', data => {
        console.log('ice candidate', data);
        socket.to(data.to).emit('ice candidates', {
            candidate: data.candidate,
            sender: data.sender
        });
    })
})
http.listen(8000, () => {
    console.log('Listening on port 8000');
})
https.listen(8443, () => {
    console.log('listening on port 8443');
})
