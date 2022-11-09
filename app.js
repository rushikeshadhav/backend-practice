require("dotenv").config();
const express = require("express");
const User = require("./model/user");
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!(firstname && lastname && email && password)) {
    res.status(400).send("All fields are required");
  }

  const extUser = await User.findOne(email);
  if (extUser) {
    res.status(400).send("User already exists");
  }
});

module.exports = app;
