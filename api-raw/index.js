/*
 * Author: Ashiqur Rahman
 * Date: 202110202025
 */

//dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handle-req-res");

//app object - module scaffolding
const app = {};

// configuration
app.config = {
  port: 3000,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log("Server listening on " + app.config.port);
  });
};

// handle request response
app.handleReqRes = handleReqRes;

app.createServer();
