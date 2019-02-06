module.exports = (io, socket) => {
  // Listen for 'new user'
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat! ✋`);
    io.emit('new user', username);
  });

  // Listen for new messages
  socket.on('new message', (data) => {
    // send that data to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    io.emit('new message', data);
  });
};
