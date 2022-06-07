const msgform = document.querySelector('#form')
const msginput = document.querySelector('#input')
const msgbutton = document.querySelector('#button')
const messages = document.querySelector('#messages')
const msgtemplate = document.querySelector('.msg-template').innerHTML
const locations = document.querySelector('#location')
const loctemplate = document.querySelector('.loc-template').innerHTML
const socket1 = io()
socket1.on('Message', (message) => {
    console.log(message);
    const html = Mustache.render(msgtemplate, {
        message: message.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})
document.querySelector('#form').addEventListener('submit', function(e) {
    // When submitting a form, the browser sends a request to the server and refreshes the page. 
    // To disable this behavior, you can use event.preventDefault() when clicking the button
    e.preventDefault();
    const msg = document.querySelector('input').value
        // msgbutton.setAttribute('disabled', 'disabled')
    socket1.emit('SendMessage', msg, (error) => {
        msginput.value = ''
        msgbutton.removeAttribute('disabled')
        msginput.focus()
        if (error) {
            return console.log(error);
        }
        console.log('message is delivered');
    })
})
const locbutton = document.querySelector('#location')
document.querySelector('#location').addEventListener('click', function(e) {
    e.preventDefault()
    locbutton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('access denied')
    }
    navigator.geolocation.getCurrentPosition((position, callback1) => {
        locbutton.removeAttribute('disabled')
            // console.log(position)
        console.log('location shared');
        socket1.emit('SendMessage', { latitude: position.coords.latitude, longitude: position.coords.longitude })
    })
})
socket1.on('LocationMessage', (url) => {
        console.log(url);
        const html = Mustache.render(loctemplate, {
            url,
            CreatedAt1: moment(message.CreatedAt).format('h:mm a')
        })
        messages.insertAdjacentHTML('beforeend', html)
    })
    // ignoreQueryPrefix ye jo username ke aage question mark hai use remove ya ignore kar dega
    // destructing 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    // client se event emit or server pe listen hoga
socket1.emit('join', ({ username, room }))