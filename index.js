const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// port
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("carbana backend server");
});

app.listen(port, () => {
  console.log(`carbana backend server is running on port: ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yiog314.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const carCollection = client.db("carDB").collection("cars");
    const userCollection = client.db("carDB").collection("users");
    const cartCollection = client.db("carDB").collection("carts");

    // cars related APIs
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });

    app.get("/newcars/:brandname", async (req, res) => {
      const brandName = req.params.brandname;
      const query = { brand: brandName };
      const cursor = carCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      // console.log(newCar);
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      // console.log(updatedCar);
      const car = {
        $set: {
          title: updatedCar.title,
          type: updatedCar.type,
          price: updatedCar.price,
          brand: updatedCar.brand,
          model: updatedCar.model,
          fuel: updatedCar.fuel,
          drive: updatedCar.drive,
          colors: updatedCar.colors,
          doors: updatedCar.doors,
          cylinders: updatedCar.cylinders,
          transmission: updatedCar.transmission,
          rating: updatedCar.rating,
          image: updatedCar.image,
          details: updatedCar.details,
        },
      };
      const result = await carCollection.updateOne(filter, car, options);
      res.send(result);
    });

    // users related APIs
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      // console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // carts realted APIs
    app.get("/carts", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/userCart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/userCart/:productId", async (req, res) => {
      const id = req.params.productId;
      const query = { productId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const newItem = req.body;
      const result = await cartCollection.insertOne(newItem);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
