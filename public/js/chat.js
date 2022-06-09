const socket1 = io()
const msgform = document.querySelector('#form')
const msginput = document.querySelector('input')
const msgbutton = document.querySelector('button')
const messages = document.querySelector('#messages')
const msgtemplate = document.querySelector('.msg-template').innerHTML
const loctemplate = document.querySelector('.loc-template').innerHTML
const locbutton = document.querySelector('#location')
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
// ignoreQueryPrefix ye jo username ke aage question mark hai use remove ya ignore kar dega
// destructing 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = messages.lastElementChild;

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = messages.offsetHeight;

    // Height of messages container
    const containerHeight = messages.scrollHeight;

    // How far we have scrolled 
    const scrollOffset = messages.scrollTop + visibleHeight; //scrollTop stores how far we have scrolled down from the top

    //scrolling will be done if this is true
    if (containerHeight - newMessageHeight <= scrollOffset + 5) { //containerHeight is the height of message container after adding new message, so subtracting that will tell if were at bottom before or not
        messages.scrollTop = messages.scrollHeight;
    }
    console.log(newMessageStyles);
};
// Template
socket1.on('Message', (message) => {
    console.log(message);
    const html = Mustache.render(msgtemplate, {
        username: message.username,
        message: message.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket1.on('LocMessage', (message) => {
        console.log(message);
        const html = Mustache.render(loctemplate, {
            username: message.username,
            url: message.url,
            CreatedAt: moment(message.CreatedAt).format('h:mm a'),
        })
        messages.insertAdjacentHTML('beforeend', html)
        autoscroll()

    })
    // event listener
document.querySelector('#form').addEventListener('submit', function(e) {
    // When submitting a form, the browser sends a request to the server and refreshes the page. 
    // To disable this behavior, you can use event.preventDefault() when clicking the button
    e.preventDefault();
    const msg = document.querySelector('input').value
    msgbutton.setAttribute('disabled', 'disabled')
    socket1.emit('SendMessage', msg, (error) => {
        msgbutton.removeAttribute('disabled')
        msginput.value = ' '
        msginput.focus()
        if (error) {
            return console.log(error);
        }
        console.log('message is delivered');
    })
})
document.querySelector('#location').addEventListener('click', function(e) {
    if (!navigator.geolocation) {
        return alert('access denied')
    }
    e.preventDefault()
    locbutton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        locbutton.removeAttribute('disabled')
            // console.log(position)
        console.log('location shared');
        socket1.emit('LocationMessage', { latitude: position.coords.latitude, longitude: position.coords.longitude })
    })
})

// client se event emit or server pe listen hoga

// socket1.on('roomData', ({ room, users }) => {
//     console.log(room);
//     console.log(users);
// })

socket1.on('roomData', ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    });
    document.getElementById('sidebar').innerHTML = html;
});

socket1.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
})