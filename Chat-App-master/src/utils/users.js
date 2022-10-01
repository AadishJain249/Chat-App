const users = []
    // 4 functions
    // add user
    // remove user
    // get user
    // get user room
const adduser = ({ id, username, room }) => {
    // Aadish aadish are same user thats why we use tolowercase
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
        //     // check if above is filled or not
    if (!room || !username) {
        return {
            error: 'fill the above details'
        }
    }
    // check for existing user
    const exist = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (exist) {
        return {
            error: 'user is already registered'
        }
    }
    //  store user if user doesnt exist in chat app
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const remove = (id) => {
    const index = users.findIndex((user) => user.id === id)
        //  -1 agar id find nhi hoti unique id
        // 0 or greater than 0 if id is found
        // first arg is which position is to be deleted
        // second arg is how many items is to be deleted
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
const getuser = (id) => {
    // return users.find((user) => user.id === id)
    return users.find((user) => user.id === id)

}

const getroom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}
module.exports = {
    adduser,
    remove,
    getuser,
    getroom
}