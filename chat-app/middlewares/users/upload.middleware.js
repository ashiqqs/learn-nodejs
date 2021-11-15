const uploader = require("../../utilities/single-upload");

function uploadAvatar(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, .jpeg or png format allowed!"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(400).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = uploadAvatar;
