/*
 * Description: App startup file
 * Author: Ashiqur Rahman
 * Date: 202110202025
 */

const server = require("./lib/server");
const worker = require("./lib/worker");

//dependencies


//app object - module scaffolding
const app = {};

app.init = () =>{
  //Starting server
  server.init();

  //Starting worker
  worker.init();
}


app.init();

module.exports = app;
