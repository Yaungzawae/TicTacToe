const n = 3
const checkBoard = (board,rowId,colId,symbol,socket, room) =>{
    const announceResult = ()=>{
        socket.emit("win", true);
        socket.to(room).emit("win" , false)
    }
    for(let i = 0; i < n; i++){ //row
        if(board[rowId][i] !== symbol){
            break;
        }
        if(i === n-1){
            announceResult();
            console.log(`${symbol} wins by row`)
        }
    }
    for(let i = 0; i < n; i++){ //col
        if(board[i][colId] !== symbol){
            break;
        }
        if(i === n-1){
            announceResult();
            console.log(`${symbol} wins by col`)
        }
    }
    if(rowId === colId){
        for(let i = 0; i < n; i++){ //dia
            if(board[i][i] !== symbol){
                break;
            }
            if(i === n-1){
                announceResult()
                console.log(`${symbol} wins by dia`)
            }
        }
    }
    if(rowId + colId === n - 1){
        for(let i = 0; i < n; i++){
            if(board[i][n-1-i] !== symbol){
                break
            }
            if(i === n-1){
                announceResult();
                console.log(`${symbol} wins by antiDia`)
            }
        }
    }
}

module.exports = checkBoard