var _ = require("./shared");
const path = require("path");
const os = require("os");
const fs = require("fs");
const EventEmmiter = require("events");
const Action = require("./action");

//console.log(path.parse(__filename))

//_.print(os.version());
//_.print(os.userInfo());
//_.print(os.release());
//_.print(os.freemem());
//_.print(os.cpus());

// fs.appendFile("myfile.txt", "\nHello World\n", (err, data) => {
//   console.log(err);
//   console.log(data);
// });
//fs.renameSync("myfile.text", "myfile.txt");
// fs.readFile("myfile.txt", (err, data) => {
//   console.log(err);
//   console.log(data.toString());
// });

const action = new Action();

action.on("fire", (message) => {
  _.print(message);
});

action.on("kill", (message) => {
  _.print(message);
});

action.fire();
action.kill();
