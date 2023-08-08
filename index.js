const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    const packageCollectionOf3 = client
      .db("La-Riveria")
      .collection("semiPackages");

    // Packages API

    // full packges

    app.get("/packages", async (req, res) => {
      const query = {};
      const cursore = packageCollection.find(query);
      const packges = await cursore.toArray();
      res.send(packges);
    });

    //half packges

    app.get("/packagesof3", async (req, res) => {
      const query = {};
      const cursore = packageCollectionOf3.find(query);
      const halfpackages = await cursore.toArray();
      res.send(halfpackages);
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
