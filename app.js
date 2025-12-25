/* eslint-disable no-console */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();

const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

app.use(cors());
app.use(express.json());

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch(console.error);
