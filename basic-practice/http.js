const http = require("http");

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.write("Hello from node.js");
      res.end();
      break;
    case "/home":
      res.write("This is home page");
      res.end();
      break;
    default:
      res.write("Page not found.");
      res.end();
      break;
  }
});

server.listen(3000,() => {
  console.info("Server listening on port 3000");
});
