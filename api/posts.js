const express = require('express')
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
    console.log("A request has been made to /posts");
    next();
});

const {requireUser} = require('./utils')
const {getALLPosts, createPost, getPostById, updatePost, deletePost}= require('../db')

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

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const post_Id = req.params.postId;
    const {title, content, tags=""} = req.body;
    const fields= {}
    if (title){
        fields.title= title;
    }
    if (content){
        fields.content= content;
    }
    if (tags){
        if(tags.length>0){
            fields.tags=tags.trim().split(/\s+/);
        }
    }

    try {
        const originalPost= await getPostById(post_Id);
        if (originalPost.author.id===req.user.id){
            const updatedPost=await updatePost(post_Id, fields);
            res.send({post: updatedPost})
        } else {
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot update a post that is not yours'
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }

})

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    const post_Id = req.params.postId;
    console.log(post_Id);
    
    try {
        const postToDelete = await getPostById(post_Id)

        if (postToDelete.author.id===req.user.id){
            const returnedPost = await deletePost(post_Id)
            console.log(returnedPost)
            res.send({"post": returnedPost})
        }else{
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot delete a post that is not yours'
            })
        }       
    } catch ({name, message}) {
        next({name, message});
    }
})

postsRouter.get('/', async (req, res) =>{
    try {
        const allPosts = await getALLPosts();

        const activePosts = allPosts.filter(elem => elem.active)

        res.send({activePosts})
        
    } catch (error) {
        
    }
    
})


module.exports = postsRouter;
