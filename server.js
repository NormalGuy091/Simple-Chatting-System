import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))
const rooms = new Set()

io.on('connection', (socket) => {
    console.log(`User connected to the main server: ${socket.id}`)

    // Create a room
    socket.on('create-room', (room) => {
        

        if (!room || rooms.has(room)) {
            socket.emit('room-error', 'Room already exists or invalid!')
            return
        }
        room = room?.trim()
        rooms.add(room)
        socket.emit('room-created', room)
        console.log(`Created room: `, room)
        
    })

    socket.on('join-room', (room) => {
        room = room.trim()

        if (!room || !rooms.has(room)) {
            socket.emit('room-error', `Room doesn't exists or invalid`)
            return
        }

        if (socket.data.room) {
            socket.leave(socket.data.room)
        }
        socket.join(room)
        socket.data.room = room
        socket.emit('joined-room', room)
        socket.to(room).emit('chat-message', 'System', `Someone has connected!`)
    })

    socket.on('chat-message', (message) => {
        const room = socket.data.room
        

        if (!room || typeof message !== 'string')  {
            
            return 0
        }

        const text = message.trim().slice(0, 500)
        if (!text) {
            return
        }
        
        io.to(room).emit('chat-message', `User: ${text}`)

    })
    socket.on('disconnect', () => {
        console.log("User disconnected: ", socket.id)
    })
})

server.listen(9000)