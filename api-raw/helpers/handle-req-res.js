/**
 * Author: Ashiqur Rahman
 * Date: 202110220041
 */

//dependencies
const { StringDecoder } = require("string_decoder");
const url = require("url");
const {
  notFoundHandler,
} = require("../handlers/route-handlers/not-found-handlers");
const routes = require("../routes");

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObj = parsedUrl.query;
  const headerObj = req.headers;

  const requestProps = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObj,
    headerObj
  };

  const decoder = new StringDecoder("utf-8");
  let realData = '';

  const selectedHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

    selectedHandler(requestProps, (statusCode, payload) => {
        statusCode = typeof(statusCode)==='number'?statusCode:500;
        payload = typeof(payload) ==='object'?payload:{};

        res.writeHead(statusCode);
        res.end(JSON.stringify(payload));

    })

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    console.log(realData);
  });
};

module.exports = handler;
