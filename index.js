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

    // Packages API

    app.get("/packages", async (req, res) => {
      const query = req.query.limit;
      const queryInt = parseInt(query);
      if (query) {
        const result = await packageCollection.find().limit(queryInt).toArray();
        res.send(result);
      } else {
        const result = await packageCollection.find().toArray();
        res.send(result);
      }
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
      const query = {};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
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
