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
const { GenerateMsg, Generateloc } = require('./src/utils/message')
app.use(express.static(dir))
let message = 'Welcome Here!'
io.on('connection', (socket) => {
    console.log('Web Socket io is connected');
    socket.emit('Message', GenerateMsg('Welcome!'))
    socket.broadcast.emit('Message', GenerateMsg('new user is joined'))
    socket.on('SendMessage', (msg, callback) => {
        const Filter = new filter()
        if (Filter.isProfane(msg)) {
            return callback('this message is not allowed')
        }
        // everytime server emits an event it is emitting an object
        io.emit('Message', GenerateMsg(msg))
            // callback()
    })
    socket.on('LocationMessage', (coords, callback) => {
        io.emit('Message', Generateloc(`http://google.com/maps?q=:${coords.latitude},${coords.longitude}`))
            // callback()
    })

    socket.on('disconnect', () => {
        io.emit('Message', GenerateMsg('a user has left'))
    })
})
server.listen(port, () => {
    console.log(`server is listening at ${port}`);
})