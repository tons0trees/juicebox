const express = require('express')
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
    console.log("A request has been made to /posts");
    next();
});

const {getALLPosts}= require('../db')

postsRouter.get('/', async (req, res) =>{
    const posts = await getALLPosts();
    res.send({
        posts
    })
})


module.exports = postsRouter;
