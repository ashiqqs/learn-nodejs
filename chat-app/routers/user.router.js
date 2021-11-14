//external imports
const express = require("express");

//internal imports
const { login, getUsers } = require("../controllers/user.controller");

const userRoute = express.Router();

//login page
userRoute.get("/login", login);
userRoute.get("/", getUsers);

module.exports = userRoute;
