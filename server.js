const express = require('express');

const actionRouter = require('./routers/actionRouter');
const projectRouter = require('./routers/projectRouter');
const server = express();

server.use('/api/actions', actionRouter);
server.use('/api/projects', projectRouter);

server.get('/', (req, res) => {
  res.send(`<h2> Server Running <h2>`);
});

module.exports = server;
