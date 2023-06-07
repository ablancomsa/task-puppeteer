const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./controller/users");
const app = express();

const mongoUrl =
  "mongodb+srv://user_node_restapi:VdKjTvfIrW2Q76JL@clusterrestapi.2sbf2c0.mongodb.net/restApiDB-test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);

module.exports = app;
