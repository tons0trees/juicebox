const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");

async function createUser({ username, password, name, location }) {
    try {
        const {
            rows: [user],
        } = await client.query(
            `
        INSERT INTO users(username, password, name, location) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
            [username, password, name, location]
        );
        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");

    if (setString.length === 0) return;

    try {
        const {
            rows: [user],
        } = await client.query(
            `
            UPDATE users
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `,
            Object.values(fields)
        );

        return user;
    } catch (error) {
        throw error;
    }
}

async function getALLUsers() {
    const { rows } = await client.query(
        `SELECT id, username, name, location, active
        FROM users;
        `
    );
    return rows;
}

async function createPost({ authorId, title, content }) {
    try {
        const {
            rows: [posts],
        } = await client.query(
            `
        INSERT INTO posts("authorId", title, content)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
            [authorId, title, content]
        );
        return posts;
    } catch (error) {
        throw error;
    }
}

async function updatePost(id, { title, content, active }) {
    const queryString = `
        UPDATE posts
        SET title=$1, content=$2, active=$3
        WHERE id=${id}
        RETURNING *;`;

    if (queryString.length === 0) return;

    try {
        const {
            rows: [post],
        } = await client.query(queryString, [title, content, active]);
        return post;
    } catch (error) {
        throw error;
    }
}

async function getALLPosts() {
    const { rows } = await client.query(
        `SELECT id, "authorId", title, content, active
        FROM posts;
        `
    );
    return rows;
}

async function getPostsByUser(userId) {
    try {
        const { rows: posts } = await client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${userId};
      `);
        return posts;
    } catch (error) {
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const {
            rows: [user],
        } = await client.query(`
    SELECT id, username, name, location FROM users
        WHERE id=${userId};
    `);

        if (user != undefined) {
            const post = await getPostsByUser(userId);
            user["posts"] = post;
            return user;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

async function createTags(tagList) {
    if (tagList.length === 0) return;
    
    try {
        const valueStr1 = tagList.map((elem,index) => `($${index+1})`).join(', ')

        await client.query(`
            INSERT INTO tags(name)
            VALUES ${valueStr1}
            ON CONFLICT (name) DO NOTHING;
        `,tagList);

        const valueStr2 = tagList.map((elem,index) => `$${index+1}`).join(', ')
        const {rows} = await client.query(`
            SELECT * FROM tags
            WHERE name
            IN (${valueStr2});
        `,tagList)

        return rows
    } catch (error) {
        throw error
    }
}

    async function createPostTag(postId, tagId){
        try{
            await client.query(`
            INSERT INTO post_tags("postId", "tagId")
            VALUES ($1, $2)
            `, [postId, tagId]);
            console.log('i am working')
        }catch(error){
            throw error;
        }
    }

    async function addTagsToPost(postId, tagList) {
        try {
            const createPostTagPromises = tagList.map(
                (tag) => {createPostTag(postId, tag.id)
                });
                await Promise.all(createPostTagPromises);
                console.log('working')

        } catch (error) {
            throw error;
        }


}

module.exports = {
    client,
    getALLUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getALLPosts,
    getPostsByUser,
    getUserById,
    createTags,
    addTagsToPost
}
