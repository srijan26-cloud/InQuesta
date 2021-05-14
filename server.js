const path = require('path');//get url
const express = require('express');//get express
const http = require('http');//used by express but here directly used for socket.io

const app = express();

const server = http.createServer(app);

const socketio = require('socket.io');//for bidirectional message

//this io() is called by main.js as chat.html executes main.js
const io = socketio(server);

//get functions from utils folder
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');



//Set Static folder
app.use(express.static(path.join(__dirname , 'public')));

//Run when client connects
io.on('connection' , socket => {
    console.log('new connection');
    socket.on('joinRoom' , ({username , room}) => {

        const user = userJoin(socket.id , username , room);
        
        //socket function
        socket.join(user.room);

        //server.emit() fun is used for particular client only
        socket.emit('message' , formatMessage('',`${user.username} , you joined`));

        //it is used to broadcaste except the perticular client
        //broadcast when user connects
        //socket.broadcast.emit('message',formatMessage('','a user has joined'));
        socket.broadcast.to(user.room).emit('message',formatMessage('',`${user.username} joined`));
    
        //Send users and room
        io.to(user.room).emit('roomUsers' , {
            room :user.room,
            users:getRoomUsers(user.room)
        });
    });
    

    //Listening to chatMessages from client 
    //emit from main.js
    socket.on('chatMessage', (msg) => {
        //console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message' , formatMessage(user.username , msg));
    });

    //Run when user disconnects
    socket.on('disconnect',() => {
        const user = userLeave(socket.id);
        
        if(user){
            //It is used to broadcast to everyone
            io.to(user.room).emit('message' , formatMessage('',`${user.username} left`));
        
            //Send users and room
            io.to(user.room).emit('roomUsers' , {
                room :user.room,
                users:getRoomUsers(user.room)
            });

        }

    });

});



const PORT = 3000 || process.env.PORT;//get port

//Server listen
//app.listen(PORT , () => console.log(`Server running on port ${PORT} ..`));
server.listen(PORT , () => console.log(`Server running on port ${PORT} ..`));