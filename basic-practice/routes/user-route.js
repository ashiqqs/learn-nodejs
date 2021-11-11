const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logMiddleware = require("../middleware/logger");
const authMiddleware = require('../middleware/auth-guard.middlware');


router.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    userName: req.body.userName,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", logMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(401).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).send("Invalid Password");
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.name },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.send({ token: token, user: user.name });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/', async(req, res) => {
  const users = await User.find().populate('todos', "-_id -__v -date -user");
  return res.json(users);
})

router.get('/:id', async(req, res) => {
  const users = await User.find({_id:req.params.id}).populate('todos', "-_id -__v -date -user");
  return res.json(users);
})

module.exports = router;
