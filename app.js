/* eslint-disable no-console */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

function authorizeUser(req, res, next) {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  console.log("Mock user ID set:", req.user._id);
  next();
}

app.use(express.json());
app.use(cors());
app.use(authorizeUser);
app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
