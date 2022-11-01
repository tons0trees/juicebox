const express = require('express')
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
    console.log("A request has been made to /posts");
    next();
});

const {requireUser} = require('./utils')
const {getALLPosts, createPost}= require('../db')

postsRouter.post('/', requireUser, async (req, res, next) => {
    const {title, content, tags=""} = req.body

    const tagsArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagsArr.length) postData.tags = tagsArr

    
    try {
        postData.authorId = req.user.id
        postData.title = title
        postData.content = content
        
        const newPost = await createPost(postData)
        res.send({newPost})
    } catch ({name, message}) {
        next({name, message})
    }
})

postsRouter.get('/', async (req, res) =>{
    const posts = await getALLPosts();
    res.send({
        posts
    })
})


module.exports = postsRouter;
