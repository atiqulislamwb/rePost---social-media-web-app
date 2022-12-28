const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const URL = process.env.MONGO_DB_URI;
const PORT = 4000;

const client = new MongoClient(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const connect = async () => {
  await client.connect();
};

const _db = client.db("rePost");
const Users = _db.collection("users");
const Posts = _db.collection("posts");
const Comments = _db.collection("comments");

app.get("/", (req, res) => {
  console.log(`request received at ${new Date()}`);
  console.dir(req.ip);
  //console.dir(res);
  res.send(`request received at ${new Date()} `);
});

//users route
app.post("/users", async (req, res) => {
  try {
    const newData = req.body;
    await Users.insertOne(newData);
    res.status(201).json({ status: true, message: "User added successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Users.findOne({ email: email });
    res.status(200).json({ status: true, data: user });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});
app.put("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const data = req.body;

    await Users.updateOne(
      { email: email },
      {
        $set: {
          name: data?.name,
          imgUrl: data?.imgUrl,
          university: data?.university,
          address: data?.address,
        },
      }
    );

    return res
      .status(200)
      .json({ status: true, message: "Updated  successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

//posts
app.get("/posts", async (req, res) => {
  try {
    const allPosts = await Posts.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json({ status: true, data: allPosts });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: ObjectId(id) };
    const post = await Posts.findOne(filter);
    res.status(200).json({ status: true, data: post });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});
app.post("/posts", async (req, res) => {
  try {
    const newData = req.body;
    await Posts.insertOne(newData);
    res.status(201).json({ status: true, message: "Post added successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = data.id;
    const likeCount = data.likeCount;
    await Posts.updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          like_count: likeCount,
        },
      }
    );

    return res
      .status(200)
      .json({ status: true, message: "Product advertised successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

//comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comments.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ status: true, data: comments });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

app.post("/comments", async (req, res) => {
  try {
    const newData = req.body;
    await Comments.insertOne(newData);
    res.status(201).json({ status: true, message: "Comment successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

//////////////////////////////////////////////////////////////
app.use("/*", async (req, res) => {
  res.status(400).json({ message: "The Route doesn't exist" });
});

app.listen(PORT, async () => {
  await connect();

  console.log("database connection established");
  console.log(`Server is running on port : ${PORT}`);
});
