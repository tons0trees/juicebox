const portNum = 3000;
const express = require('express');
const server = express();

const {client} = require('./db');
client.connect();

const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json())

//First middleware piece
server.use((req, res, next) => {
    console.log('<___Body Logger START___>');
    console.log(req.body);
    console.log('<___Body Logger END___>');

    next();
})

const apiRouter = require("./api");
server.use('/api', apiRouter);

  

server.listen(portNum, () => {
    console.log('The server is up and listening on port:', portNum);
})