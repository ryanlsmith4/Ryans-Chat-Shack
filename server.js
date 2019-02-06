// Dependencies
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;
// Socket.io has to use the http Server
const server = require('http').Server(app);
// Define handlebars
const exphbs = require('express-handlebars');


// Socket.io
const io = require('socket.io')(server);

io.on('Connection', (socket) => {
  console.log(`🔌 New user connected! 🔌 ${socket}`);
});

// MiddleWare
app.use('/public', express.static('public'));

// Express View Engine for handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('index.handlebars');
});

server.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
