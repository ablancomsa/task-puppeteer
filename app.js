const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./controller/users");
const app = express();

const mongoUrl =
  "mongodb+srv://user_node_restapi:VdKjTvfIrW2Q76JL@clusterrestapi.2sbf2c0.mongodb.net/restApiDB-test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl);

const corsOptions = {
  origin: 'https://vercel.com/ablanco-msageoconsul/front-version-windows.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", userRouter);

module.exports = app;
