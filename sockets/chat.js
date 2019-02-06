module.exports = (io, socket) => {
  // Listen for 'new user'
  socket.on('new user', (username) => {
    console.log(`${username} has joined the chat! ✋`);
  });
};
