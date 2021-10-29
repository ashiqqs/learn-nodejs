/**
 * Author: Ashiqur Rahman
 * Data: 202110291727
 */

const appConfig = require("../../helpers/environments");
const { ENTITY, MESSAGE, HTTP_STATUS } = require("../../helpers/helper.enums");
const utilities = require("../../helpers/utilities");
const db = require("../../lib/data");

const allowdMethod = ["get", "post", "put", "delete"];

const handler = {};

handler.tokenHandler = (requestProps, callback) => {
  if (allowdMethod.indexOf(requestProps.method) >= 0) {
    handler._token[requestProps.method](requestProps, callback);
  } else {
    callback(405, {
      message: "Method not allowed",
    });
  }
};

handler._token = {};

handler._token.get = (requestProps, callback) => {
  if (requestProps.queryStringObj.token) {
    const token = requestProps.queryStringObj.token;
    db.read(ENTITY.TOKENS, token, (err, data) => {
      if (!err && data) {
        callback(HTTP_STATUS.OK, {
          data: utilities.parseJson(data),
        });
      } else {
        callback(HTTP_STATUS.NOT_FOUND, {
          message: MESSAGE.NOT_FOUND,
        });
      }
    });
  } else {
    callback(HTTP_STATUS.BAD_REQ, {
      message: MESSAGE.BAD_REQUEST,
    });
  }
};

handler._token.post = (requestProps, callback) => {
  const loginObj = { ...requestProps.body };
  if (loginObj.mobileNo && loginObj.password) {
    db.read(ENTITY.USERS, loginObj.mobileNo, (err, data) => {
      if (err) {
        callback(HTTP_STATUS.SERVER_ERR, {
          message: err,
        });
      } else {
        const user = utilities.parseJson(data);
        const hashedPass = utilities.hash(loginObj.password);
        if (hashedPass === user.password) {
          const token = utilities.getRandomStr(appConfig.tokenLength);
          const tokenObj = {
            mobileNo: loginObj.mobileNo,
            token,
            expires: Date.now() + 60 * 60 * 1000,
          };
          db.create(ENTITY.TOKENS, token, tokenObj, (err) => {
            if (!err) {
              callback(HTTP_STATUS.OK, { message: tokenObj });
            } else {
              callback(HTTP_STATUS.SERVER_ERR, { message: MESSAGE.SERVER_ERR });
            }
          });
        } else {
          callback(HTTP_STATUS.UNAUTHORIZE, {
            message: MESSAGE.UNAUTHORIZE,
          });
        }
      }
    });
  } else {
    callback(HTTP_STATUS.BAD_REQ, {
      message: MESSAGE.BAD_REQUEST,
    });
  }
};

handler._token.put = (requestProps, callback) => {
  if (requestProps.body.token && requestProps.body.extend) {
    db.read(ENTITY.TOKENS, requestProps.body.token, (err, data) => {
      if (!err && data) {
        const tokenObj = utilities.parseJson(data);
        if (tokenObj.expires > Date.now()) {
          tokenObj.expires = tokenObj.expires + Date.now() * 60 * 60 * 1000;
          db.update(ENTITY.TOKENS, tokenObj.token, tokenObj, (err) => {
            if (!err) {
              callback(HTTP_STATUS.OK, {
                message: "Token expiration extended.",
              });
            } else {
              callback(HTTP_STATUS.SERVER_ERR, {
                message: MESSAGE.SERVER_ERR,
              });
            }
          });
        } else {
          callback(HTTP_STATUS.BAD_REQ, {
            message: "Token expired.",
          });
        }
      } else {
        callback(HTTP_STATUS.NOT_FOUND, {
          message: MESSAGE.NOT_FOUND,
        });
      }
    });
  } else {
    callback(HTTP_STATUS.BAD_REQ, {
      message: MESSAGE.BAD_REQUEST,
    });
  }
};

handler._token.delete = (requestProps, callback) => {
  const reqObj = requestProps.body;
  if (reqObj.token) {
    db.delete(ENTITY.TOKENS, reqObj.token, (err) => {
      if (!err) {
        callback(HTTP_STATUS.OK, {
          message: MESSAGE.DELETED,
        });
      } else {
        callback(HTTP_STATUS.NOT_FOUND, {
          message: MESSAGE.NOT_FOUND,
        });
      }
    });
  } else {
    callback(HTTP_STATUS.BAD_REQ, {
      message: MESSAGE.BAD_REQUEST,
    });
  }
};

handler._token.verify = (mobileNo, token, callback) => {
  if (mobileNo && token) {
    db.read(ENTITY.TOKENS, token, (err, data) => {
      if (!err && data) {
        const tokenObj = utilities.parseJson(data);
        if (tokenObj.mobileNo === mobileNo && tokenObj.expires > Date.now()) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

module.exports = handler;
