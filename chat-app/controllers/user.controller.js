function login(req, res, next) {
  res.render("index");
}

function getUsers(req, res, next) {
  res.render("users");
}

function addUser(req, res, next) {
  res.render("addUser");
}

module.exports = {
  login,
  getUsers,
  addUser,
};
