/* eslint no-undef: "off" */
/* eslint guard-for-in: "off" */
/* eslint no-restricted-syntax: "off" */
$(document).ready(() => {
  // Connect to socket.io Server
  const socket = io.connect();
  // Keep track of the current user
  let currentUser;
  socket.emit('get online users');
  // Each user should be in the general by default.
  socket.emit('user changed channel', 'General');

  // Users can change the channel by clicking on its name.
  $(document).on('click', '.channel', (e) => {
    const newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
  });


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

    const channel = $('.channel-current').text();
    // Get the message text value
    const message = $('#chatInput').val();
    // Make sure it's not empty
    if (message.length > 0) {
      // Emit the message with the current user to the Server
      socket.emit('new message', {
        sender: currentUser,
        message,
        channel,
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
    // Only append the message if the user is in chat.
    const currentChannel = $('.channel-current').text();
    if (currentChannel == data.channel) {
    $('.messageContainer').append(`
      <div class='message'>
        <p class='messageUser'>${data.sender}:</p>
        <p class-'messageText'>${data.message}</p>
      </div>
    `);
  }
  });

  socket.on('get online users', (onlineUsers) => {
    for (const username in onlineUsers) {
      $('.usersOnline').append(`<p class='userOnline'>${username}</p>`);
    }
  });

  // remove person once logged off
  socket.on('user has left', (onlineUsers) => {
    $('.usersOnline').empty();
    for (const username in onlineUsers) {
      $('usersOnline').append(`<p>${username}</p>`);
    }
  });

  $('#newChannelBtn').click(() => {
    const newChannel = $('#newChannelInput').val();

    if (newChannel.length > 0) {
      // Emit the new channel to server
      socket.emit('new channel', newChannel);
      $('#newChannelInput').val();
    }
  });

  // Add the new channel to the channels list (Fires for all clients)
  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.messageContainer').append(`
        <div class="message">
          <p class="messageUser">${message.sender}: </p>
          <p class="messageText">${message.message}</p>
        </div>
      `);
    });
  });
});
