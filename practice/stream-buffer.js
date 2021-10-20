const fs = require("fs");

const streamReader = fs.createReadStream(`${__dirname}/stream.txt`);
const streamWriter = fs.createWriteStream(`${__dirname}/stream-write.txt`);

let count = 0;
// streamReader.on("data", (buffer) => {
//     streamWriter.write(
//     `\n---------------------------------------------- Buffer-${++count}------------------------------------------------\n`
//   );
//   streamWriter.write(buffer);
// });

streamReader.pipe(streamWriter)
streamReader.on("close", () => {
  console.log("Stream closed");
});

console.log("Start reading stream...");
