const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

const validateUser = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must be alphabetic")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Email must be valid")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already exists");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", { strictMode: true })
    .withMessage("Mobile must be valid")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw new Error("Mobile already exists");
        }
      } catch (err) {
        createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long, contain at least one number and one special character"
    ),
];

validateUserHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (res.files.length > 0) {
      const { fileName } = req.files[0];
      unlink(
        path.join(__dirname, `/public/uploads/avatars/${fileName}`),
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }
  res.status(500).json({ errors: mappedErrors });
};

module.exports = {
  validateUser,
  validateUserHandler,
};
