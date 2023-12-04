const express = require("express");
const cors = require("cors");
const ToyRoutes = require("./routes/toys.js");
const userRoutes = require("./routes/users.js");
const app = express();
const path=require("path");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));

app.use("/api/v1/toys", ToyRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/test", (req, res) => {
  res.json({ msg: "works properly" });
});

/* Global error handler */
app.use((error, req, res, next) => {
  console.log("error from the app=>>>>>", error);
  return res.status(400).send({ msg: error.message });
});
module.exports.app = app;
