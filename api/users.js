const express = require('express')
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
    console.log("A request has been made to /users");
    next();
});

const {getALLUsers, getUserByUsername}=require('../db');

usersRouter.get('/', async (req, res)=> {
    const users = await getALLUsers();
    res.send({
        users
    });
});

usersRouter.post('/login', async (req, res, next)=> {
    const {username, password} = req.body;

    if (!username || !password){
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        })
    }
    try {
        const user = await getUserByUsername(username);
        if (user && user.password == password){
            const jwt=require('jsonwebtoken')
            const token = jwt.sign(user, 'process.env.JWT_SECRET')
            res.send({
                message: "you're logged in!",
                "token": token
            });
        } else {
            next({
                name: 'incorrectCredentialsError',
                message: 'Username or password is incorrect'
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = usersRouter;