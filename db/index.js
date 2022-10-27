const {Client} = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createUser({username, password, name, location}) {
    try{
        const {rows: [user]}= await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name, location]);
        return user;
    } catch(error){
        throw error;
    }

}

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map((key,index) => `"${key}"=$${index+1}`).join(', ');

    if (setString.length === 0) return;

    try {
        const {rows: [user]} = await client.query(`
            UPDATE users
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    }
}

async function getALLUsers() {
    const {rows} = await client.query(
        `SELECT id, username, name, location, active
        FROM users;
        `);
        return rows;
}

async function createPost({authorId, title, content}) {
    try {
        const results = client.query(`
        INSERT INTO posts("authorId", title, content)
        VALUES (${authorId}, ${title}, ${content})
        ON CONFLICT (title) DO NOTHING
        RETURN *;
        `)
        return results
    } catch (error) {
        throw error;
    }
}

async function updatePost(id, {title, content, active}) {
    const queryString = `
        UPDATE posts
        SET title=${title}, content=${content}, active=${active}
        WHERE id=${id}
        RETURNING *;`
  
    if(setString.length === 0) return;

   try {
    const response = await client.query(queryString);
    return response;
    } catch (error) {
        throw error;
    }
}

async function getALLPosts() {
    const {rows} = await client.query(
        `SELECT id, "authorId", title, content, active
        FROM posts;
        `);
        return rows;
}

module.exports = {client, getALLUsers, createUser, updateUser, createPost, updatePost, getALLPosts}