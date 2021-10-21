/**
 * Author: Ashiqur Rahman
 * Data: 202110220055
 */

 const handler = {};

 handler.notFoundHandler = (requestProps, callback) => {
    callback(404, {
      message: "404 Not found",
    });
  };
 
 module.exports = handler;
 