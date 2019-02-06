
$(document).ready(() => {
  // Connect to socket.io Server
  const socket = io.connect();

  $('#createUserBtn').click((e) => {
    e.preventDefault();
    const username = $('#usernameInput').val();
    if (username.length > 0) {
      // Emit to server the new user
      socket.emit('new user', username);
      $('.usernameForm').remove();
    }
  });


  // socket Listeners
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
  });
});
