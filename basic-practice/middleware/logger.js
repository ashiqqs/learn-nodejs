const routeLog = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} - ${req.method} - ${req.originalUrl} - Request By ${req.userName}`);
  next();
};


module.exports = routeLog;