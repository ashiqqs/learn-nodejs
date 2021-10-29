/*
 *Author: Ashiqur Rahman
 * Date: 202110202025
 */

//dependencies
const appConfig = require("./helpers/environments");
const http = require("http");
const { handleReqRes } = require("./helpers/handle-req-res");
const db = require("./lib/data");

//app object - module scaffolding
const app = {
  createServer: () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(appConfig.port, () => {
      console.log(
        `Server listening on ${appConfig.port} in ${appConfig.envName}`
      );
    });
  },

  handleReqRes: handleReqRes,
};

// const obj = { hello: "world", language: "javascript" };
// db.create("", "hello", obj, (result) => {
//   console.log(result);
// });

// db.read('', "hello", (err, data) => {
//     if(!err){
//       console.log(data);
//     }else{
//       console.error(err)
//     }
// });

// obj.language = 'typescript'
// db.update('', "hello", obj, (result) => {
//   console.log(result);
// });

// db.delete('', 'hello', (result) => {
//   console.log(result);
// })

app.createServer();
