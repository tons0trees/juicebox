const {client, getALLUsers} = require('./index');

async function dropTables() {
    try{
        await client.query(`DROP TABLE IF EXISTS users;`);
    }catch (error) {
        throw error;
    }
}

async function createTables(){
    try{
       console.log("Starting to build tables...")
       
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY, 
            username varchar(255) UNIQUE NOT NULL, 
            password varchar(255) NOT NULL
        );
        `);

        console.log("Finished building tables!")
    }catch (error) {
        console.log("Error building tables!")
        throw error;
    }
}

async function rebuildDB(){
    try{
        client.connect();
        await dropTables();
        await createTables();

    } catch(error){
        console.error(error)
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...")

        const users = await getALLUsers();
        console.log("getALLUsers:", users);

        console.log("Finished database test!");
    } catch (error) {
        console.error(error);
        throw error;
    } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());