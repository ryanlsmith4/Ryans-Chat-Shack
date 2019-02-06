
$(document).ready(() => {
  // Connect to socket.io Server
  const socket = io.connect();

  // Keep track of the current user
  let currentUser;


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
    let message = $('#chatInput').val();
    // Make sure it's not empty
    if (message.length > 0) {
      // Emit the message with the current user to the Server
      socket.emit('new message', {
        sender: currentUser,
        message: message,
      });
      $('chaiInput').val('');
    }
  });


  // socket Listeners
  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);
    // add the new user to the online users div
    $('.userOnline').append(`<div class='userOnline'>${username}</div>`);
  });

  socket.on('new message', (data) => {
    $('.messageContainer').append(`
      <div class='message'>
        <p class='messageUser'>${data.sender}:</p>
        <p class-'messageText'>${data.message}</p>
      </div>
    `);
  });
});
