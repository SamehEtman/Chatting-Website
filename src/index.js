const express = require('express');
const path =require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words')
const {generateMessage , generateLocation} = require('./utils/messages')
const { addUser,removeUser, getUser, getUsersInRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const publicDirPath = path.join(__dirname , '../public');
app.use(express.static(publicDirPath));

const port = process.env.PORT;

io.on("connection" , (socket)=>{
    console.log('every thing is ok');
   
    

    socket.on('join' , (options , callback) =>{
        const {user ,error} = addUser({id : socket.id , ...options})
        if (error)
            return callback(error)

        socket.join(user.room);
        socket.emit('message' , generateMessage('SERVER' , 'Welcome!'))
        socket.broadcast.to(user.room).emit('message' ,generateMessage('SERVER' ,`${user.username} has joined!`)) 

        io.to(user.room).emit('roomData' , {
            room : user.room,
            users :getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage' , (message , callback) =>{
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message))
            return callback("Profanity isn't allowed")
        io.to(user.room).emit('message' , generateMessage(user.username , message));
        callback('Message Deliverd')
    })

    socket.on('disconnect' , ()=>{
        const user = removeUser(socket.id)
        if (user){
            io.to(user.room).emit('message' , generateMessage('SERVER',`${user.username} has left the chat`))
            io.to(user.room).emit('roomData' , {
                room : user.room,
                users :getUsersInRoom()

            })
        }
    })

    socket.on('sendLocation' , (coord, callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage' , generateLocation(user.username ,`https://google.com/maps?q=${coord.lat},${coord.long}`) )
        callback('location delivered')
    })
});

server.listen(port , ()=>{
    console.log('service is running on port' , port);
})