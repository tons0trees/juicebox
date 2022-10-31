const express = require('express')
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const {getUserById} = require('../db');
const {JWT_SECRET} = process.env;

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer '
    const auth = req.headers['Authorization']

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const {id} = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            
        }
    }
})


const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);



module.exports = apiRouter;