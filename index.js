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
    app.get("/totalProducts",async(req,res)=>{
      const result = (await ProductCollection.find().toArray()).length
       res.json(result)
    })

    app.get("/products", async (req, res) => {
      const { search, sortBy, Brand, Category, MinPrice, MaxPrice ,page} = req.query;
      // console.log(search, sortBy, Brand, Category, MinPrice, MaxPrice);

      let query = {}; // This will handle search
      let filterCriteria = {}; // This will handle filtering by brand, category, and price range

      // Search by name
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      // Filter by Brand
      if (Brand) {
        filterCriteria = { ...filterCriteria, brand: Brand };
      }

      // Filter by Category
      if (Category) {
        filterCriteria = { ...filterCriteria, category: Category };
      }

      // Filter by Price Range
      console.log(MinPrice , MaxPrice );
      
      if (MinPrice || MaxPrice ) {
        filterCriteria = { ...filterCriteria, price: {} };
        if (MinPrice > 0) filterCriteria.price.$gte = parseFloat(MinPrice);
        if (MaxPrice > 0) filterCriteria.price.$lte = parseFloat(MaxPrice);
      }
      // console.log(filterCriteria);
      
      // Sorting Criteria
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

      try {
        // Merge query and filterCriteria
        let finalQuery = {};
        if (query.name["$regex"] !== " " && filterCriteria) {
          finalQuery = { ...query, ...filterCriteria };
        } else if (filterCriteria && filterCriteria.price !== " ") {
          finalQuery = { ...filterCriteria };
        }
        console.log(finalQuery);
        // Find, sort, and return products
        const result = await ProductCollection.find(finalQuery)
          .sort(sortCriteria)
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send("Error retrieving products: " + error.message);
      }
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
