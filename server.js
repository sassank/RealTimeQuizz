const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || 4444;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use('/', express.static(__dirname + '/public'));

let usernames = {};
let pairCount = 0;
let id;
let pgmstart = 0;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("New player connected!");

    socket.on('addClient', (username) => {
        socket.username = username;
        usernames[username] = username;
        varCounter = 0;
        pairCount++;
        if (pairCount === 1 || pairCount >= 3) {
            id = Math.round((Math.random() * 1000000));
            socket.room = id;
            pairCount = 1;
            console.log(pairCount + " " + id);
            socket.join(id);
            pgmstart = 1;
        } else if (pairCount === 2) {
            console.log(pairCount + " " + id);
            socket.join(id);
            pgmstart = 2;
        }

        console.log(username + " joined to " + id);

        socket.emit('updatechat', 'SERVER', 'Vous êtes connecté <br> En attente du joueur...', id);

        socket.broadcast.to(id).emit('updatechat', 'SERVER', username + ' a rejoins la partie!', id);

        if (pgmstart == 2) {
            fs.readFile(__dirname + "/lib/questions.json", "Utf-8", (err, data) => {
                if (err) throw err;
                const jsoncontent = JSON.parse(data);
                io.sockets.in(id).emit('sendQuestions', jsoncontent);
            });
            console.log("Player2");
        } else {
            console.log("Player1");
        }
    });

    socket.on('result', (usr, rst) => {
        io.sockets.in(rst).emit('viewresult', usr);
    });

    socket.on('disconnect', () => {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.leave(socket.room);
    });
});
