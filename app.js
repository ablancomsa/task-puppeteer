const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./controller/users");
const app = express();

const mongoUrl =
  "mongodb+srv://user_node_restapi:VdKjTvfIrW2Q76JL@clusterrestapi.2sbf2c0.mongodb.net/restApiDB-test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl);

const whiteList = [
  "https://front-version-windows.vercel.app"
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", userRouter);

module.exports = app;
