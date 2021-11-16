//external imports
const express = require("express");

//internal imports
const {
  login,
  getUsers,
  addUser,
  removeUser,
} = require("../controllers/user.controller");
const viewHandler = require("../middlewares/common/view-handler.middleware");
const uploadAvatar = require("../middlewares/users/upload.middleware");
const {
  validateUser,
  validateUserHandler,
} = require("../middlewares/users/user-validator.middleware");
const userRoute = express.Router();

//login page
userRoute.get("/", viewHandler("Login"), login);
userRoute.get("/user", viewHandler("User"), getUsers);
userRoute.post(
  "/user",
  uploadAvatar,
  validateUser,
  validateUserHandler,
  addUser
);

userRoute.delete("/user/:id", removeUser);

module.exports = userRoute;
