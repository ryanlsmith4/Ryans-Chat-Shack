/* eslint no-undef: "off" */
/* eslint guard-for-in: "off" */
/* eslint no-restricted-syntax: "off" */
$(document).ready(() => {
  // Connect to socket.io Server
  const socket = io.connect();
  // Keep track of the current user
  let currentUser;
  socket.emit('get online users');


  $('#createUserBtn').click((e) => {
    e.preventDefault();
    if ($('#usernameInput').val().length > 0) {
      socket.emit('new user', $('#usernameInput').val());
      currentUser = $('#usernameInput').val();
      $('usernameForm').remove();
      // Have the main page visible
      $('.mainContainer').css('display', 'flex');
    }
  });

  $('#sendChatBtn').click((e) => {
    e.preventDefault();
    // Get the message text value
    const message = $('#chatInput').val();
    // Make sure it's not empty
    if (message.length > 0) {
      // Emit the message with the current user to the Server
      socket.emit('new message', {
        sender: currentUser,
        message,
      });
      $('#chatInput').val('');
    }
  });


  // socket Listeners
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // add the new user to the online users div
    $('.usersOnline').append(`<p class='userOnline'>${username}</p>`);
  });

  socket.on('new message', (data) => {
    $('.messageContainer').append(`
      <div class='message'>
        <p class='messageUser'>${data.sender}:</p>
        <p class-'messageText'>${data.message}</p>
      </div>
    `);
  });

  socket.on('get online users', (onlineUsers) => {
    for (username in onlineUsers) {
      $('.usersOnline').append(`<p class='userOnline'>${username}</p>`);
    }
  });

  // remove person once logged off
  socket.on('user has left', (onlineUsers) => {
    $('.usersOnline').empty();
    for (username in onlineUsers) {
      $('usersOnline').append(`<p>${username}</p>`);
    }
  });
});
