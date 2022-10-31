const express = require('express')
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
    console.log("A request has been made to /users");
    next();
});

const {getALLUsers}=require('../db');

usersRouter.get('/', async (req, res)=> {
    const users = await getALLUsers();
    res.send({
        users
    });
});

module.exports = usersRouter;