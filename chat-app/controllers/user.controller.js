function login(req, res, next) {
  res.json({
    result: "Not implemented.",
  });
}

function getUsers(req, res, next){
  res.json({
    result: 'Get All users'
  })
}

module.exports = {
  login, getUsers
};
