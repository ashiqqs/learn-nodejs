const { check, validationResult } = require("express-validator");

const loginValidator = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

const loginValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length > 0) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  } else {
    next();
  }
};

module.exports = {
  loginValidator,
  loginValidatorHandler,
};
