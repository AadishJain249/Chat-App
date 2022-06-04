// const socket = io()
//     // same name in this which was given to the server side
//     // server is sending info to the client
// socket.on('CountUpdate', (count) => {
//     console.log('the count has been updated', count);
// })
// document.querySelector('.increment').addEventListener('click', () => {
//     console.log('Clicked!');
//     socket.emit('increment')
// })
// const e = require("express")
const msgform = document.querySelector('.form')
const msginput = document.querySelector('input')
const msgbutton = document.querySelector('button')
const socket1 = io()
socket1.on('Message', (message) => {
    console.log(message);
})
document.querySelector('.form').addEventListener('submit', function(e) {
    // When submitting a form, the browser sends a request to the server and refreshes the page. 
    // To disable this behavior, you can use event.preventDefault() when clicking the button
    e.preventDefault();
    const msg = document.querySelector('input').value
    msgbutton.setAttribute('disabled', 'disabled')
    socket1.emit('SendMessage', msg, (error) => {
        // msgbutton.removeAttribute('disabled')
        msginput.value = ''
        msginput.focus()
        if (error) {
            return console.log(error);
        }
        console.log('message is delivered');
    })
})
const locbutton = document.querySelector('.location')
document.querySelector('.location').addEventListener('click', function(e) {
    e.preventDefault()
    locbutton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('access denied')
    }
    navigator.geolocation.getCurrentPosition((position, callback1) => {
        locbutton.removeAttribute('disabled')
        console.log(position)
        console.log('location shared');
        socket1.emit('SendMessage', { latitude: position.coords.latitude, longitude: position.coords.longitude })
    })
})