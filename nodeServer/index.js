//Node server which will handle socket io connections

// const io = require("socket.io")(4100);
const io = require("socket.io")(4100, {
    cors: {
        origin: "http://localhost:5500",
        methods: ["GET", "POST"]
    }
});
const users = {};

io.on('connection', socket => {
    //If any new user joins, let other users
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, boradcast it to other people
    socket.on('bhej', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    //If someone leaves the chat let other know
    socket.on('disconnect', () =>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
})
