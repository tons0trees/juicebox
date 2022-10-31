const portNum = 3000;
const express = require('express');
const server = express();

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