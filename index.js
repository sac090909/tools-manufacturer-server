const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z12ej.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolsCollection = client.db("tools_manufacturer").collection("tools");
    const purchaseCollection = client
      .db("tools_manufacturer")
      .collection("purchase");
    const reviewCollection = client
      .db("tools_manufacturer")
      .collection("review");
    const profileCollection = client
      .db("tools_manufacturer")
      .collection("myProfile");

    //get all tools
    app.get("/tools", async (req, res) => {
      const query = {};
      const tools = await toolsCollection.find(query).toArray();
      res.send(tools);
    });

    // app.get("/tools", async (req, res) => {
    //   //const date = req.query.date;

    //   // step 1:  get all services
    //   //const services = await serviceCollection.find().toArray();
    //   const tools = await toolsCollection.find().toArray();

    //   // step 2: get the booking of that day. output: [{}, {}, {}, {}, {}, {}]
    //   const query = { date: date };
    //   const purchase = await puchaseCollection.find(query).toArray();

    //   // step 3: for each service
    //   services.forEach((service) => {
    //     // step 4: find bookings for that service. output: [{}, {}, {}, {}]
    //     const serviceBookings = bookings.filter(
    //       (book) => book.treatment === service.name
    //     );
    //     // step 5: select slots for the service Bookings: ['', '', '', '']
    //     const bookedSlots = serviceBookings.map((book) => book.slot);
    //     // step 6: select those slots that are not in bookedSlots
    //     const available = service.slots.filter(
    //       (slot) => !bookedSlots.includes(slot)
    //     );
    //     //step 7: set available to slots to make it easier
    //     service.slots = available;
    //   });

    //   res.send(services);
    // });

    //get one tool
    app.get("/tools/:toolsId", async (req, res) => {
      const id = req.params.toolsId;
      const query = { _id: ObjectId(id) };
      const tool = await toolsCollection.findOne(query);
      res.send(tool);
    });
    //post purchase
    app.post("/purchase", async (req, res) => {
      const toolPurchased = req.body;
      const result = await purchaseCollection.insertOne(toolPurchased);
      res.send(result);
    });
    //post review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    //get reviews
    app.get("/reviews", async (req, res) => {
      const query = {};
      const reviews = await reviewCollection.find(query).toArray();
      res.send(reviews);
    });
    //get my profile
    app.get("/myprofile/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const profile = await profileCollection.findOne(query);
      res.send(profile);
    });

    //get my orders
    app.get("/purchase", async (req, res) => {
      const email = req.query.user;
      const query = { email: email };
      const orders = await purchaseCollection.find(query).toArray();
      res.send(orders);
    });
    //delete order
    app.delete("/purchase/:orderId", async (req, res) => {
      const orderId = req.params.orderId;
      console.log(orderId);
      const query = { _id: ObjectId(orderId) };
      const result = await purchaseCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => res.send("Creative Tools Manufacturer"));

app.listen(port, () => {
  console.log(`Tools Manufacturer App listening on port ${port}`);
});
