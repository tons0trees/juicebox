const express = require('express')
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
    console.log("A request has been made to /users");
    next();
});

const {getALLUsers, getUserByUsername, createUser}=require('../db');
const jwt=require('jsonwebtoken')

usersRouter.get('/', async (req, res)=> {
    const users = await getALLUsers();
    res.send({
        users
    });
});

usersRouter.post('/register', async (req, res, next)=> {
    const {username, password, name, location } = req.body;
    
    try {
        const userObj = await getUserByUsername(username)
        if (userObj){
            next({
                name:'UserExistsError',
                message:'A user by that username already exists'
            })
        }
        const newUser = await createUser({
            "username": username, 
            "password": password, 
            "name": name, 
            "location": location
        })
        const token = jwt.sign(
            newUser, 
            process.env.JWT_SECRET, 
            {expiresIn: '1w'}
        )

        res.send({
            message: "thank you for signing up",
            "token": token
        })
    } catch ({name, message}) {
        next({name, message})
    }
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
            const token = jwt.sign(user, process.env.JWT_SECRET)
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