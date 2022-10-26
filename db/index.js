const {Client} = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getALLUsers() {
    const {rows} = await client.query(
        `SELECT id, username
        FROM users;
        `);
        return rows;
}

module.exports = {client, getALLUsers}