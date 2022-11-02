const express = require("express");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request has been made to /tags");
    next();
});

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
    const tagName = req.params.tagName;
    try {
        const allPosts = await getPostsByTagName(tagName);

        const activePosts = allPosts.filter((elem) => {
            return elem.active || (req.user && elem.author.id === req.user.id);
        });

        res.send({
            posts: activePosts,
        });
    } catch ({ name, message }) {
        next({ names, message });
    }
});

tagsRouter.get("/", async (req, res) => {
    const tags = await getAllTags();
    res.send({
        tags,
    });
});

module.exports = tagsRouter;
