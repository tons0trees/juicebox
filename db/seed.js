const {client, getALLUsers, createUser} = require('./index');

async function dropTables() {
    try{
        await client.query(`DROP TABLE IF EXISTS users;`);
    }catch (error) {
        throw error;
    }
}

async function createInitialUsers(){
    try{
        console.log("Starting to create users...");

    const albert = await createUser({ username: 'albert', password: 'bertie99' });

    const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });

    const glamgal = await createUser({ username: 'glamgal', password: 'soglam' });



    console.log(albert);

    console.log("Finished creating users!");
    }catch(error){
        console.error("Error creating users!");
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
        await createInitialUsers();

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