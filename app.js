const express = require('express')
const app = express()
const filter = require('bad-words')
const socket = require('socket.io')
const path = require('path')
const http = require('http')
const server = http.createServer(app)
const io = socket(server)
const port = 3000
const dir = path.join(__dirname, './public')
const { adduser, remove, getuser, getroom } = require('./src/utils/users');
const { GenerateMsg, Generateloc } = require('./src/utils/message');
app.use(express.static(dir))
    // let message = 'Welcome Here!'
    // message send by user
io.on('connection', (socket) => {
    console.log('Web Socket io is connected');

    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = adduser({ id: socket.id, username, room }); //socket.id is unique to every connection 
        if (error) {
            return callback(error);
        }
        socket.join(user.room); //this gives us the options call certain events to certain rooms only and not to everyone
        socket.emit('Message', GenerateMsg('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('Message', GenerateMsg('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getroom(user.room)
        })
    });

    socket.on('SendMessage', (msg, callback) => {
        const user = getuser(socket.id)
        const Filter = new filter()
        if (Filter.isProfane(msg)) {
            return callback('this message is not allowed')
        }
        // everytime server emits an event it is emitting an object
        io.to(user.room).emit('Message', GenerateMsg(user.username, msg))
        callback()
    })

    socket.on('LocationMessage', (coords, callback) => {
            const user = getuser(socket.id)
            io.to(user.room).emit('LocMessage', Generateloc(user.username, `http://google.com/maps?q=:${coords.latitude},${coords.longitude}`))
            callback()
        })
        // room is channel in which socket can leave or join
        // socket.join to access those room
        // socket.to().emit('') to broadcast or emit a event

    socket.on('disconnect', () => {
        const user = remove(socket.id);
        if (user) {
            io.to(user.room).emit('Message', GenerateMsg('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getroom(user.room)
            });
        }
    })
})
server.listen(port, () => {
    console.log(`server is listening at ${port}`);
})