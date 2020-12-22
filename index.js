const cron = require("node-cron");
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL =
  "mongodb+srv://codeUser:P4ppN72KhGuGpJD9@codetable.ubtee.mongodb.net/CodeTable?retryWrites=true&w=majority";
const DATABASE_NAME = "CodeTable";
const config = require("./config.json");

// Import the library:
var cors = require("cors");

var app = Express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(process.env.PORT || 5000, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("Codes");
      console.log("Connected to `" + DATABASE_NAME + "`!");
    }
  );
});

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.get("/codes", (request, response) => {
  collection
    .find({})
    .limit(100)
    .toArray((error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result);
    });
});

app.get("/codes/:value", (request, response) => {
  collection
    .find({
      $or: [
        {
          code: { $regex: `.*${request.params.value}.*` },
        },
        {
          longDescription: { $regex: `.*${request.params.value}.*` },
        },
      ],
    })
    .limit(100)
    .toArray(function (error, result) {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result);
    });
});

// Schedule tasks to be run on the server.

// Load HCPCS Codes From CMS Annually
cron.schedule("0 0 1 1 *", function () {
  console.log("Running tasks every year");
});
