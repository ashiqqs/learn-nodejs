//external imports
const express = require("express");

//internal imports
const {
  getLogin,
  getUsers,
  addUser,
  removeUser,
  login,
  logout,
} = require("../controllers/user.controller");
const {
  checkLogin,
  redirectLogin,
} = require("../middlewares/common/check-login.middleware");
const viewHandler = require("../middlewares/common/view-handler.middleware");
const {
  loginValidator,
  loginValidatorHandler,
} = require("../middlewares/users/login-validator.middleware");
const uploadAvatar = require("../middlewares/users/upload.middleware");
const {
  validateUser,
  validateUserHandler,
} = require("../middlewares/users/user-validator.middleware");
const userRoute = express.Router();

//login page
userRoute.get("/", viewHandler("Login"), redirectLogin, getLogin);
userRoute.post(
  "/",
  viewHandler("login"),
  loginValidator,
  loginValidatorHandler,
  login
);
userRoute.delete("/logout", logout);

//Users page
userRoute.get("/user", viewHandler("User"), checkLogin, getUsers);
userRoute.post(
  "/user",
  checkLogin,
  uploadAvatar,
  validateUser,
  validateUserHandler,
  addUser
);
userRoute.delete("/user/:id", checkLogin, removeUser);
module.exports = userRoute;
