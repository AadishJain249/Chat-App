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
app.use(express.static(dir))
    // server side is connected
let count = 0
    // here socket is object which contains info
    // socket.io we send data and transfer are using event

// 1.CHALLENGE

// io.on('connection', (socket) => {
//     console.log('web socket io is connected');
//     socket.emit('CountUpdate', count)
//     socket.on('increment', () => {
//         count++
//         // console.log()
//         // socket.emit('CountUpdate', count) // emit event to specific connection expect current client
//         io.emit('CountUpdate', count) // emit event to all connection
//             // example agar mene socket se kara hota to ek jagh hi change hota and update nhi hota magar
//             // agar mene io use kara ho to real time me change hoga data aur update hoga 
//     })
// })

// 2.CHALLENGE-> to print welcome msg
// message is welcome here
// Message is used for emiting event 
// msg is what i am sending the msg
let message = 'Welcome Here!'
io.on('connection', (socket) => {
    // console.log('Web Socket io is connected');
    socket.emit('Message', message)
    socket.broadcast.emit('Message', 'new user is joined')
    socket.on('SendMessage', (msg, callback) => {
        const Filter = new filter()
        if (Filter.isProfane(msg)) {
            return callback('this message is not allowed')
        }
        io.emit('Message', msg)
        callback()
    })
    socket.on('SendMessage', (coords, callback1) => {
        io.emit('Message', `http://google.com/maps?q=:${coords.latitude},${coords.longitude}`)
        callback1()
    })
    socket.on('disconnect', () => {
        io.emit('Message', 'a user has left')
    })
})
server.listen(port, () => {
    console.log(`server is listening at ${port}`);
})