const {client, getALLUsers, createUser, updateUser, createPost, updatePost, getALLPosts, getPostsByUser, getUserById, createTags, addTagsToPost, getPostById, getPostsByTagName} = require('./index');

async function dropTables() {
    try{
        await client.query(`DROP TABLE IF EXISTS post_tags;`);
        await client.query(`DROP TABLE IF EXISTS tags;`);
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

        await client.query(`
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE post_tags (
                "postId" INTEGER REFERENCES posts(id), 
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE ("postId", "tagId")
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

async function createInitialPosts() {
    const makePost = await createPost({authorId: '2', title: 'test post', content: 'this is a test', tags:['#hey', '#hello']})
    const makePost2 = await createPost({authorId: '1', title: 'test post #2', content: 'this is a test#2', tags: ['#a', '#b']})
    const makePost3 = await createPost({authorId: '1', title: 'test post #3', content: 'this is a test#3', tags: ['#hello', '#6']})
    const makePost4 = await createPost({authorId: '3', title: 'test post #4', content: 'this is a test#4', tags: []})

}

async function createInitialTags() {
    try {
        console.log("Starting to create tags...");

        const [happy, sad, inspo, catman] = await createTags([
            '#happy',
            '#worst-day-ever',
            '#youcandoanything',
            '#catmandoeverything'
        ]);

        const [postOne, postTwo, postThree] = await getALLPosts();

        await addTagsToPost(postOne.id, [happy, inspo]);
        await addTagsToPost(postTwo.id, [sad, inspo]);
        await addTagsToPost(postThree.id, [happy, catman, inspo]);

        console.log("Finished creating tags!");
    } catch (error) {
       console.log("Error creating tags!");
        throw error 
    }
}


async function rebuildDB(){
    try{
        client.connect();
        
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
        await createInitialTags();

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

        // console.log("Calling updateUser on user[0]");
        // const updateUserResults = await updateUser(users[0].id, {name: "newName sogood", location: "Lesterville, KY"})
        // console.log("Result: ", updateUserResults);


        console.log("Calling getall posts");
        const posts = await getALLPosts()
        console.log(posts);

        // console.log("editing a post");
        // const post = await updatePost(1,{title: '1', content: 'this is content', active: true})
        // console.log(post)

        // console.log("get all posts");
        // const getAllposts= await getALLPosts()
        // console.log(getAllposts)

        // console.log("Posts by user");
        // const postsByUser= await getPostsByUser(2)
        // console.log(postsByUser)

        // console.log("user by id");
        // const userById = await getUserById(1)
        // console.log(userById)


        
        // const tagsWeMade = await createTags(['ABC','DEF','GHI']);
        // console.log(tagsWeMade)
        
        // console.log("Add tags to post");
        // await addTagsToPost(2, tagsWeMade);
        
        // console.log("get postid")
        // const postById = await getPostById(2)
        // console.log(postById)

        // console.log("ids")
        // const post_id = await getPostById(2)
        // console.log(post_id)

        // console.log("all posts")
        // const all_posts = await getALLPosts()
        // console.log(all_posts)

        console.log("Calling updatePost on post[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[1].id, {
        tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("Result:", updatePostTagsResult);

        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);
        


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