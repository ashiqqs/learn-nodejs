/**
 * Author: Ashiqur Rahman
 * Data: 202110220053
 */

//dependencies
const {sampleHandler} = require('./handlers/route-handlers/sample-handlers');
const { userHandler } = require('./handlers/route-handlers/user-handler');

const routes = {
    sample: sampleHandler,
    user: userHandler
}

module.exports = routes;