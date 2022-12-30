const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7k8mkis.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('socialMedia').collection('post');
        const aboutCollection = client.db('socialMedia').collection('about');
        


       
        app.post('/post', async(req, res) =>{
            const user = req.body;
            console.log(user);
            const result = await serviceCollection.insertOne(user)
            res.send(result);
        })

        app.get('/post', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({_id:-1});;
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
          app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // About section

        app.post('/about', async(req, res) =>{
            const user = req.body;
            console.log(user);
            const result = await aboutCollection.insertOne(user)
            res.send(result);
        })

          app.get('/about', async (req, res) => {
            const query = {}
            const cursor = aboutCollection.find(query).sort({_id:-1});
            const about = await cursor.toArray();
            res.send(about);
        });
        app.get('/about/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await aboutCollection.findOne(query);
            res.send(service);
        });
        app.put('/about/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            console.log(user)
            const option = {upsert: true};
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    university: user.university,
                    address: user.address
                }
            }
            const result = await aboutCollection.updateOne(filter, updateUser, option);
            res.send(result);
        })
        
       
        
    }
    finally{
        
    }

}
run().catch(err => console.error(err));


app.get('/', async(req, res) =>{
    res.send('social media server is running')
})

app.listen(port, () => console.log(`Social media running on ${port}`))
