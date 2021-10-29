/**
 * Description: Check URL handler
 * Author: Ashiqur Rahman
 * Data: 202110300006
 */

const appConfig = require("../../helpers/environments");
const { ENTITY, HTTP_STATUS, MESSAGE } = require("../../helpers/helper.enums");
const utilities = require("../../helpers/utilities");
const db = require("../../lib/data");
const { _token } = require("./token-handler");

const allowdMethod = ["get", "post", "put", "delete"];

const handler = {};

handler.checkHandler = (requestProps, callback) => {
  if (allowdMethod.indexOf(requestProps.method) >= 0) {
    handler._check[requestProps.method](requestProps, callback);
  } else {
    callback(HTTP_STATUS.NOT_ALLOWED, {
      message: MESSAGE.NOT_ALLOW,
    });
  }
};

handler._check = {};

handler._check.get = (requestProps, callback) => {};

handler._check.post = (requestProps, callback) => {
  const reqObj = requestProps.body;
  let protocol =
    typeof reqObj.protocol === "string" &&
    ["http", "https"].indexOf(reqObj.protocol) > -1
      ? reqObj.protocol
      : false;
  let url =
    typeof reqObj.url === "string" && reqObj.url.trim().length > 0
      ? reqObj.url
      : false;
  let method =
    typeof reqObj.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(reqObj.method) > -1
      ? reqObj.method
      : false;
  let successCodes =
    typeof reqObj.successCodes === "object" &&
    reqObj.successCodes instanceof Array
      ? reqObj.successCodes
      : false;
  let timeOutSec =
    typeof reqObj.timeOutSec === "number" &&
    reqObj.timeOutSec % 1 === 0 &&
    reqObj.timeOutSec > 0 &&
    reqObj.timeOutSec <= 5
      ? reqObj.timeOutSec
      : false;
  if (protocol && url && method && successCodes && timeOutSec) {
    const token = requestProps.headerObj.token;
    db.read(ENTITY.TOKENS, token, (readTokenErr, tokenData) => {
      if (!readTokenErr && tokenData) {
        const tokenObj = utilities.parseJson(tokenData);
        db.read(ENTITY.USERS, tokenObj.mobileNo, (readUserErr, userData) => {
            if (!readUserErr && userData) {
            let user = utilities.parseJson(userData);
            _token.verify(user.mobileNo, token, (isVerified) => {
              if (isVerified) {
                let userChecks =
                  typeof user.checks === "object" &&
                  user.checks instanceof Array
                    ? user.checks
                    : [];
                if (userChecks.length < appConfig.maxChecks) {
                  let check = {
                    id: utilities.getRandomStr(20),
                    userMobileNo: user.mobileNo,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSec,
                  };
                  db.create(ENTITY.CHECKS, check.id, check, (checkAddErr) => {
                    if (!checkAddErr) {
                      userChecks.push(check.id);
                      user.checks = userChecks;
                      db.update(
                        ENTITY.USERS,
                        user.mobileNo,
                        user,
                        (userUpdateErr) => {
                          if (!userUpdateErr) {
                            callback(HTTP_STATUS.OK, { message: check });
                          } else {
                            callback(HTTP_STATUS.SERVER_ERR, {
                              message: MESSAGE.SERVER_ERR,
                            });
                          }
                        }
                      );
                    } else {
                      callback(HTTP_STATUS.SERVER_ERR, {
                        message: MESSAGE.SERVER_ERR,
                      });
                    }
                  });
                } else {
                  callback(HTTP_STATUS.BAD_REQ, {
                    message: "User maximum check list exceeded.",
                  });
                }
              } else {
                callback(HTTP_STATUS.UNAUTHENTICATE, {
                  message: MESSAGE.AUTH_FAIL,
                });
              }
            });
          } else {
            callback(HTTP_STATUS.NOT_FOUND, {
              message: "User not found",
            });
          }
        });
      } else {
        callback(HTTP_STATUS.UNAUTHENTICATE, {
          message: MESSAGE.AUTH_FAIL,
        });
      }
    });
  } else {
    callback(HTTP_STATUS.BAD_REQ, {
      message: MESSAGE.BAD_REQUEST,
    });
  }
};

handler._check.put = (requestProps, callback) => {};

handler._check.delete = (requestProps, callback) => {};

module.exports = handler;
