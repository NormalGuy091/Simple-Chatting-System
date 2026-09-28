const socket = io()

const currentRoom = document.getElementById('room')
const roomStatus = document.getElementById('status')
const messageInput = document.getElementById('message')
const form = document.getElementById('form')
const messages = document.getElementById('messages')

document.getElementById('create').onclick = () => {
    socket.emit('create-room', currentRoom.value)
}

document.getElementById('join').onclick = () => {
    socket.emit('join-room', currentRoom.value)
}

document.getElementById('submitbtn').onclick = () => {
    socket.emit('chat-message', messageInput.value)
}
socket.on('chat-message', (msg) => {
    const message = document.createElement('div')
    message.textContent = msg
    messages.appendChild(message)
    console.log(`Received '${message}'`)
})

socket.on('room-created', (room) => {
    currentRoom.textContent = room
    roomStatus.value = ''
    console.log(`Created room: `, room)
})

socket.on('room-error', (errmsg) => {
    alert(errmsg)
})

socket.on('joined-room', (room) => {
    currentRoom.value = ''
})