require('dotenv').config();


const { PORT = 3000 } = process.env
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json())

const cors = require("cors");
server.use(cors());

server.use((req, res, next) => {
    console.log('<___Body Logger START___>');
    console.log(req.body);
    console.log('<___Body Logger END___>');

    next();
})

const apiRouter = require("./api");
server.use('/api', apiRouter);

const {client} = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up and listening on port:', PORT);
})