const express = require("express");
const checkBoard = require("./helpers/checkBoard");
const app = express();

app.use(express.static(__dirname + "/views"))

const server = app.listen(8080,()=>{
    console.log("Server is running")
})

const io = require("socket.io")(server);
const clients = {};
const emptyBoard = [[" ", " ", " "],[" ", " ", " "],[" ", " ", " "]]
io.on("connection",(socket)=>{
    console.log(socket.id);
    console.log(io.engine.clientsCount) 

    socket.on("move",(rowId,colId,room, symbol)=>{
        console.log(rowId,colId, room);
        socket.to(room).emit("receive-move", rowId, colId)
        clients[room].board[rowId][colId] = symbol
        clients[room].board.forEach(row=>{
            console.log(row)
        })
        checkBoard(clients[room].board, rowId, colId, symbol, socket, room);
    })
    socket.on("join-room", room=>{
        if(!clients.hasOwnProperty(room)){
            console.log("joining room" + room)
            clients[room] = {
                count : 1,
                board : [[" ", " ", " "],[" ", " ", " "],[" ", " ", " "]],
                X : socket.id
            };
            socket.join(room)
            socket.emit("turn", true, "X")
        } else if(clients[room].count + 1 <= 2){
            console.log("joined room successfully")
            clients[room].count += 1;
            clients[room].O = socket.id;
            socket.join(room)
            socket.emit("turn", false, "O")
        }

        console.log(clients)
    })
    socket.on("leave-room", (room)=>{
        if(clients[room].count == 2){
            clients[room].count -= 1;
            clients[room].board = emptyBoard;
            socket.leave(room);
        } else {
            delete clients[room];
            socket.leave(room);
        }
        console.log(clients[room]) 
    })
    socket.on("reset", (room)=>{
        clients[room].board = [[" ", " ", " "],[" ", " ", " "],[" ", " ", " "]];
        socket.to(room).emit("reset")
    })
})