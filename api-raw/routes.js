/**
 * Author: Ashiqur Rahman
 * Data: 202110220053
 */

//dependencies
const { sampleHandler } = require("./handlers/route-handlers/sample-handlers");
const { tokenHandler } = require("./handlers/route-handlers/token-handler");
const { userHandler } = require("./handlers/route-handlers/user-handler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
