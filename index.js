const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5005;

// middle wares

app.use(cors());
app.use(express.json());

// mongo setup
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdfs3t2.mongodb.net/?retryWrites=true&w=majority`;

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
    const packageCollection = client.db("La-Riveria").collection("packages");
    const reviewCollection = client.db("La-Riveria").collection("reviews");
    const orderCollection = client.db("La-Riveria").collection("orders");

    // Packages API

    app.get("/packages", async (req, res) => {
      let query = {};
      // const query = req.query.limit;
      // const queryInt = parseInt(query);
      if (req.query.limit) {
        query = req.query.limit;
        const queryInt = parseInt(query);
        const result = await packageCollection.find().limit(queryInt).toArray();
        res.send(result);
      } else {
        const result = await packageCollection.find(query).toArray();
        res.send(result);
      }
      // console.log(query);
    });
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await packageCollection.findOne(query);
      res.send(result);
    });

    // Review API

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          guestEmail: req.query.email,
        };
      }
      const reviews = await reviewCollection
        .find(query)
        .sort({ date: -1 })
        .toArray();
      res.send(reviews);
    });
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const reviews = await reviewCollection.insertOne(review);
      res.send(reviews);
    });
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const message = req.body.message;
      const query = { _id: new ObjectId(id) };
      const udpdatedDoc = {
        $set: {
          message: message,
        },
      };
      const result = await reviewCollection.updateOne(query, udpdatedDoc);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    // Orders API
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    });
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const udpdatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, udpdatedDoc);
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((e) => console.error(e));

app.get("/", (req, res) => {
  res.send("La Riveria server is running");
});
app.listen(port, () => {
  console.log(`La Riveria server is running on ${port}`);
});
