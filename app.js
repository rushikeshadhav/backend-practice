require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All fields are required");
    }

    const extUser = await User.findOne(email);
    if (extUser) {
      res.status(400).send("User already exists");
    }

    const myEncryptedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: myEncryptedPass,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      "shhhh",
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;

    res.send(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All fields are required");
    }
    const user = User.findOne({ email });

    if (!email) {
      res.status(401).send("User not found");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "shhhhh", { expiresIn: "2h" });

      user.password = undefined;
      user.token = token;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
