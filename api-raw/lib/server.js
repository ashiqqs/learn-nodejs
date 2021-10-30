/*
 * Description: Server file
 * Author: Ashiqur Rahman
 * Date: 202110301242
 */

//dependencies
const appConfig = require("../helpers/environments");
const http = require("http");
const { handleReqRes } = require("../helpers/handle-req-res");

//app object - module scaffolding
const server = {};

server.createServer = () => {
  const serverObj = http.createServer(server.handleReqRes);
  serverObj.listen(appConfig.port, () => {
    console.log(
      `Server listening on ${appConfig.port} in ${appConfig.envName}`
    );
  });
};

server.handleReqRes = handleReqRes;

server.init = () => {
    server.createServer();
}

module.exports = server;
