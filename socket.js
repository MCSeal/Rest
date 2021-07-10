let io;

//sharing io
module.exports = {
    init: httpServer => {
        require('socket.io')(httpServer);
        return io;
    }
};