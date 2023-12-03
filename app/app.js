const express = require("express");
const cors = require("cors");
const ToyRoutes = require("./routes/toys.js");
const userRoutes = require("./routes/users.js");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/toys", ToyRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/test", (req, res) => {
  res.json({ msg: "works properly" });
});

/* Global error handler */

module.exports.app = app;
