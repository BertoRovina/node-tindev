const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const sensitiveData = require('./sensitiveData/sensitiveData.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// not best practice
const connectedUsers = {};

io.on('connection', socket =>{
    const { user } = socket.handshake.query;

    console.log(user, socket.id);

    connectedUsers[user] = socket.id;
});
// io.set('origins', '*:*');

mongoose.connect(sensitiveData.connectDB, {useNewUrlParser: true});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(5000);