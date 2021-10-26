/*
 *Author: Ashiqur Rahman
 * Date: 202110202025
 */

//dependencies
const appConfig = require('./helpers/environments');
const http = require("http");
const { handleReqRes } = require("./helpers/handle-req-res");

//app object - module scaffolding
const app = {

  createServer: () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(appConfig.port, () => {
      console.log(`Server listening on ${appConfig.port} in ${appConfig.envName}`);
    });
  },
  
  handleReqRes: handleReqRes
}

app.createServer();

