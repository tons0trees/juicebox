const {client, getALLUsers, createUser, updateUser, createPost, updatePost, getALLPosts, getPostsByUser} = require('./index');

async function dropTables() {
    try{
        await client.query(`DROP TABLE IF EXISTS posts;`)
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
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT TRUE
        );
        `);

        await client.query(`
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT TRUE
        );
        `);

        console.log("Finished building tables!")
    }catch (error) {
        console.log("Error building tables!")
        throw error;
    }
}

async function createInitialUsers(){
    try{
        console.log("Starting to create users...");

    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia' });

    const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: 'Not Telling'});

    const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side' });

    console.log("Finished creating users!");
    }catch(error){
        console.error("Error creating users!");
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

        console.log("Calling getAllUsers");
        const users = await getALLUsers();
        console.log("getALLUsers:", users);

        console.log("Calling updateUser on user[0]");
        const updateUserResults = await updateUser(users[0].id, {name: "newName sogood", location: "Lesterville, KY"})
        console.log("Result: ", updateUserResults);

        console.log('Creating a post');
        const makePost = await createPost({authorId: '2', title: 'test post', content: 'this is a test'})
        console.log(makePost);
        const makePost2 = await createPost({authorId: '1', title: 'test post #2', content: 'this is a test#2'})


        console.log("Calling getall posts");
        const posts = await getALLPosts()
        console.log(posts);

        console.log("editing a post");
        const post = await updatePost(1,{title: '1', content: 'this is content', active: true})
        console.log(post)

        console.log("get all posts");
        const getAllposts= await getALLPosts()
        console.log(getAllposts)

        console.log("Posts by user");
        const postsByUser= await getPostsByUser(2)
        console.log(postsByUser)



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