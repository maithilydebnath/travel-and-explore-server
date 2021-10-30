const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require ('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3eohd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
      await client.connect();
      console.log('database Connection Successful');
      const database = client.db('travelOnlineBooking');
      const placeCollection = database.collection('places');
      const bookingCollection = database.collection('booking');

      

      app.get('/places', async(req, res) => {
        const cursor = placeCollection.find({});
        const places = await cursor.toArray();
        res.send(places);
      })
// Add Place
      app.post('/places', async (req, res) => {
        const place= req.body;
        const result = await placeCollection.insertOne(place);
        res.json(result);
      
    })
// Single Place for Booking
    app.get ('/places/:id', async (req, res) => {
      const id= req.params.id;
      console.log ('getting single id');
      const query = {_id: ObjectId(id)};
      const place = await placeCollection.findOne(query);
    
      res.json(place);
      
    })

   

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      console.log('booking', booking);
      const bookingResult = await bookingCollection.insertOne(booking);
      res.json(bookingResult);
    
    })
// Get all users or booking
    app.get('/booking', async(req, res) => {
      const cursor = bookingCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    })
    // Delete Booking or User
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    })
//get single user booking details
    // app.get ('/booking/:name', async (req, res) => {
    //   const name= req.params.name;
    //   console.log ('getting single id');
    //   const query = {name: name};
    //   const myOrder = await bookingCollection.find(query);
    
    //   res.json(myOrder);
      
    // })
    app.get ('/booking/:email', async (req, res) =>{
      const query = {email: req.params.email};
      const cursor =  bookingCollection.find(query);
      const myOrder =  await cursor.toArray();
      res.json(myOrder);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', async(req, res) => {
  res.send('Welcome to Server!')
})

app.listen(port, () => {
  console.log(`Example app listening at https://vast-falls-32206.herokuapp.com`)
})