const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express ();
// middle wire////
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 3006

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he93e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("car-mechanics");
        const serviceCollection = database.collection("services");
        // create a document to insert
       //POST API---------------------------------post
       app.post('/services', async(req,res)=>{
           const service = req.body;
           console.log('hit the post',service)
           const result = await serviceCollection.insertOne(service);
            console.log(result)
        res.json(result)
          }) 
        
        //GET API -----------------------------get
        app.get('/services', async (req, res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get Single API//---------------------single api
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        //delet API ----------------------------delete
        app.delete('/services/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
      } 
    finally {
    //   await client.close();//can ignor
      }
  }
  run().catch(console.dir);


app.get('/', (req ,res)=>{
    res.send('genious car mechanic project is ready. Now it should be work')
})

app.listen(port,()=>{
    console.log("listing from",port)
})