const FILE_MODE = {
  OPEN_OR_CREATE: "a",
  OPEN: "ax",
  READ_OR_CREATE: "a+",
  READ: "ax+",
  OPEN_FILE_SYNC: "as",
  OPEN_FILE_APPEND_SYNC: "as+",
  READ: "r",
  READ_WRITE: "r+",
  READ_WRITE_SYNC: "rs+",
  WRITE_OR_CREATE: "w",
  WRITE: "wx",
  RW_CREATE_DEL: "w+",
  RW: "wx+",
};

const ENTITY = {
  USERS: "/users",
  TOKENS: "/tokens",
};

const MESSAGE = {
  SAVED: "Date saved success.",
  UPDATED: "Data updated success.",
  RETRIEVED: "Data retrieved success",
  DELETED: "Data deleted success.",
  NOT_FOUND: "Data not found",
  UNAUTHORIZE: "Unauthorize access.",
  BAD_REQUEST: "Bad request",
  SERVER_ERR: "Internal server error",
  UNKNOWN: "Unknown error occured.",
  AUTH_FAIL: 'Authentication failed.'
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQ: 400,
  UNAUTHORIZE: 401,
  UNAUTHENTICATE: 403,
  NOT_FOUND: 404,
  NOT_ALLOWED: 405,
  SERVER_ERR: 500,
};

module.exports = { FILE_MODE, ENTITY, MESSAGE, HTTP_STATUS };
