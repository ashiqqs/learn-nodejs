const bcrypt = require("bcrypt");
const Person = require("../models/person.model");
const { unlink } = require("fs");
const path = require("path");

function login(req, res, next) {
  res.render("index");
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
  getUsers,
  addUser,
  removeUser,
};
