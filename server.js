// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Socket.IO logic goes here
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Handle quiz events
    socket.on('startQuiz', () => {
        // Logic to start quiz
        io.emit('quizStarted', /* quizData */);
    });

    socket.on('submitAnswer', (answer) => {
        // Logic to handle submitted answer
        io.emit('answerSubmitted', /* resultData */);
    });
});
