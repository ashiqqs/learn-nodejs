const bcrypt = require("bcrypt");
const Person = require("../models/person.model");
const { unlink } = require("fs");
const path = require("path");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

function getLogin(req, res, next) {
  res.render("index");
}

async function login(req, res) {
  try {
    const user = await Person.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });
    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        const loggedInUser = {
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          avatar: user.avatar,
        };

        //generate token
        const token = jwt.sign(loggedInUser, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        //set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: process.env.JWT_EXPIRES_IN,
          signed: true,
        });

        res.locals.loggedInUser = loggedInUser;

        res.redirect("/inbox");
      } else {
        throw createError(401, "Invalid password");
      }
    } else {
      throw createError(401, "Invalid email or password");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged out successfully");
}

async function getUsers(req, res, next) {
  try {
    const users = await Person.find({});
    res.render("users", { users: users });
  } catch (err) {
    next(err);
  }
}

async function addUser(req, res, next) {
  try {
    let user;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
      user = new Person({
        ...req.body,
        avatar: req.files[0].filename,
        password: hashedPassword,
      });
    } else {
      user = new Person({
        ...req.body,
        password: hashedPassword,
      });
    }
    const result = await user.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await Person.findByIdAndDelete({ _id: req.params.id });

    if (user.avatar) {
      const filePath = path.join(
        __dirname,
        `../public/uploads/avatars/${user.avatar}`
      );
      unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

module.exports = {
  login,
  logout,
  getLogin,
  getUsers,
  addUser,
  removeUser,
};
