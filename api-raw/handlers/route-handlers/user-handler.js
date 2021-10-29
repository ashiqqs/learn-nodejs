/**
 * Author: Ashiqur Rahman
 * Data: 202110291141
 */

const { ENTITY, HTTP_STATUS, MESSAGE } = require("../../helpers/helper.enums");
const utilities = require("../../helpers/utilities");
const db = require("../../lib/data");
const { _token } = require("./token-handler");

const allowdMethod = ["get", "post", "put", "delete"];

const handler = {};

handler.userHandler = (requestProps, callback) => {
  if (allowdMethod.indexOf(requestProps.method) >= 0) {
    handler._user[requestProps.method](requestProps, callback);
  } else {
    callback(405, {
      message: "Method not allowed",
    });
  }
};

handler._user = {};

handler._user.get = (requestProps, callback) => {
  if (requestProps.queryStringObj && requestProps.queryStringObj.mobileNo) {
    _token.verify(
      requestProps.queryStringObj.mobileNo,
      requestProps.headerObj.token,
      (isVerified) => {
        if (isVerified) {
          db.read(
            ENTITY.USERS,
            requestProps.queryStringObj.mobileNo,
            (readErr, data) => {
              if (!readErr && data) {
                const user = { ...utilities.parseJson(data) };
                delete user.password;
                callback(200, {
                  result: user,
                  message: "Data retrieved.",
                });
              } else {
                callback(404, {
                  mesage: "User not found.",
                });
              }
            }
          );
        } else {
          callback(HTTP_STATUS.UNAUTHENTICATE, {
            message: MESSAGE.AUTH_FAIL,
          });
        }
      }
    );
  } else {
    callback(400, {
      message: "Bad request.",
    });
  }
};

handler._user.post = (requestProps, callback) => {
  const user = requestProps.body;
  db.read("/users", user.mobileNo, (err, existUser) => {
    if (err && !existUser) {
      //Encrypt user password
      const encruptedPass = utilities.hash(user.password);
      if (encruptedPass) {
        user.password = encruptedPass;
        db.create(ENTITY.USERS, user.mobileNo, user, (err) => {
          if (!err) {
            callback(200, { message: MESSAGE.SAVED });
          } else {
            callback(500, { message: "Internal server error" });
          }
        });
      } else {
        callback(500, {
          message: "Internal server error while hashing password.",
        });
      }
    } else {
      callback(400, { message: "User already exist." });
    }
  });
};

handler._user.put = (requestProps, callback) => {
  if (requestProps.body && requestProps.body.mobileNo) {
    const updatedUser = { ...requestProps.body };
    _token.verify(
      updatedUser.mobileNo,
      requestProps.headerObj.token,
      (isVerified) => {
        if (isVerified) {
          db.read(ENTITY.USERS, updatedUser.mobileNo, (readErr, data) => {
            if (!readErr && data) {
              const existUser = { ...utilities.parseJson(data) };
              if (updatedUser.firstName) {
                existUser.firstName = updatedUser.firstName;
              }
              if (updatedUser.lastName) {
                existUser.lastName = updatedUser.lastName;
              }
              if (updatedUser.password) {
                existUser.password = utilities.hash(updatedUser.password);
              }
              db.update(
                ENTITY.USERS,
                updatedUser.mobileNo,
                existUser,
                (err) => {
                  if (!err) {
                    callback(200, {
                      message: "User updated success.",
                    });
                  } else {
                    callback(400, {
                      message: err,
                    });
                  }
                }
              );
            } else {
              callback(404, {
                message: "User not found",
              });
            }
          });
        } else {
          callback(HTTP_STATUS.UNAUTHENTICATE, {
            message: MESSAGE.AUTH_FAIL,
          });
        }
      }
    );
  } else {
    callback(400, {
      message: "Bad request",
    });
  }
};

handler._user.delete = (requestProps, callback) => {
  if (requestProps.queryStringObj && requestProps.queryStringObj.mobileNo) {
    _token.verify(
      requestProps.queryStringObj.mobileNo,
      requestProps.headerObj.token,
      (isVerified) => {
        if (isVerified) {
          db.delete(
            ENTITY.USERS,
            requestProps.queryStringObj.mobileNo,
            (err) => {
              if (!err) {
                callback(200, {
                  message: "User deleted.",
                });
              } else {
                callback(500, {
                  message: err,
                });
              }
            }
          );
        } else {
          callback(HTTP_STATUS.UNAUTHENTICATE, {
            message: MESSAGE.AUTH_FAIL,
          });
        }
      }
    );
  } else {
    callback(400, {
      message: "Bad request.",
    });
  }
};

module.exports = handler;
