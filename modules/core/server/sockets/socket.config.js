'use strict';

module.exports = function (io, socket) {
  io.emit('stock:updated', {});

  // Send to all connected sockets when a stock is added
  socket.on('stock:updated', function (stock) {
    io.emit('stock:updated', stock);
  });
};
