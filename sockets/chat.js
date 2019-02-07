/* eslint no-param-reassign: "off" */
module.exports = (io, socket, onlineUsers) => {
  // Listen for 'new user'
  socket.on('new user', (username) => {
    // Save the username as a key to access the user's socket id
    onlineUsers[username] = socket.id;
    // Save the username to socket as well. this is important for later
    socket.username = username;
    console.log(`${username} has joined the chat! ✋`);
    console.log(onlineUsers);
    io.emit('new user', username);
  });

  // Listen for new messages
  socket.on('new message', (data) => {
    // send that data to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    io.emit('new message', data);
  });

  socket.on('get online users', () => {
    // send over the onlineUsers
    socket.emit('get online users', onlineUsers);
  });

  socket.on('disconnect', () => {
    // This deletes the user by the username we saved to the socket
    delete onlineUsers[socket.username];
    io.emit('user has left', onlineUsers);
  });

  socket.on('new channel', (newChannel) => {
    console.log(newChannel);
  })
};
