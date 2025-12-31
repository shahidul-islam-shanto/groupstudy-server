const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This Server is Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aazhdn7.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    const courseCollection = client
      .db("groupStudy")
      .collection("courseService");
    const checkOutCollection = client.db("groupStudy").collection("checkOut");

    app.get("/courseService", async (req, res) => {
      const course = courseCollection.find();
      const result = await course.toArray();
      res.send(result);
    });
    app.get("/courseService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.findOne(query);
      res.send(result);
    });

    app.post("/checkOut", async (req, res) => {
      const checkOut = req.body;
      const result = await checkOutCollection.insertOne(checkOut);
      res.send(result);
    });

    app.get("/checkOut", async (req, res) => {
      console.log(req.query.email);
      // if (req.query?.email !== req.user.email) {
      //   return res.status(404).send({ massage: "forbidden access" });
      // }

      let query = {};
      if (req.query?.email) {
        query = { email: req.query?.email };
      }
      const result = await checkOutCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
