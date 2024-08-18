const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URL, {
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
    // Send a ping to confirm a successful connection
    await client.db("Prodify").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const ProductCollection = client.db("Prodify").collection("products");
    const UserCollection = client.db("Prodify").collection("users");

    app.get("/products", async (req, res) => {
      const { search, sortBy } = req.query;
      console.log(search, sortBy);

      let query = {};
      if (search) {
        query = {
          name: { $regex: search, $options: "i" },
        };
      }
      let sortCriteria = {};
      switch (sortBy) {
        case "price:1":
          sortCriteria = { price: 1 }; // Sort by price in ascending order
          break;
        case "price:-1":
          sortCriteria = { price: -1 }; // Sort by price in descending order
          break;
        case "date":
          sortCriteria = { creationDate: -1 }; // Sort by creation date in descending order
          break;
        default:
          sortCriteria = {}; // No sorting
      }
      const result = await ProductCollection.find(query)
        .sort(sortCriteria)
        .toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Prodify Running Successfully");
});

app.listen(port, () => {
  console.log(`Prodify listening on port ${port}`);
});
