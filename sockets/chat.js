/* eslint no-param-reassign: "off" */
module.exports = (io, socket, onlineUsers, channels) => {
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
    channels[data.channel].push({ sender: data.sender, message: data.message });
    // send that data to ALL clients
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);
    io.to(data.channel).emit('new message', data);
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
    // Save new channel to out channels object the array will hold the messages
    channels[newChannel] = [];
    // Have the socket join the new channel room
    socket.join(newChannel);
    // Inform all clients of the new channel
    io.emit('new channel', newChannel);
    // Emit to the client that made the new channel, to change their channel
    // they made
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel],
    });
  });
};
