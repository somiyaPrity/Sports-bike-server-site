const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhf79.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('uri:', uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('sports-bike');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    const reviewsCollection = database.collection('reviews');
    const usersCollection = database.collection('users');

    // get all bikes
    app.get('/bikes', async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });
    // post all order
    app.post('/order', async (req, res) => {
      const item = req.body;
      const result = await ordersCollection.insertOne(item);
      res.json(result);
    });
    // get order data based on email
    app.get('/order/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete an order
    app.delete('/order/:id', async (req, res) => {
      console.log(req.params.id);
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    // post user to users database
    app.post('/users', async (req, res) => {
      const item = req.body;
      const result = await usersCollection.insertOne(item);
      res.json(result);
    });
    // post user as admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // app.get('/appointments', async (req, res) => {
    //   const email = req.query.email;
    //   const date = new Date(req.query.date).toLocaleDateString();

    //   const query = { email: email, date: date };

    //   const cursor = appointmentsCollection.find(query);
    //   const appointments = await cursor.toArray();
    //   res.json(appointments);
    //   res.json('appointment');
    // });

    // app.post('/appointments', async (req, res) => {
    //   const appointment = req.body;
    //   console.log(appointment);
    //   const result = await appointmentsCollection.insertOne(appointment);
    //   // console.log(result);
    //   res.json(result);
    // });
    console.log('function running');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('All bikes');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
