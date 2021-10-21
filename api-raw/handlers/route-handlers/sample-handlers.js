/**
 * Author: Ashiqur Rahman
 * Data: 202110220055
 */

const handler = {};

handler.sampleHandler = (requestProps, callback) => {
  console.log(requestProps);
  callback(200, {
    message: "This is sample url",
  });
};

module.exports = handler;
