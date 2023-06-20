const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./controller/users");
const app = express();

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

const whiteList = ["https://front-version-windows.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());
app.use(express.json());
app.use("/api", userRouter);

module.exports = app;
