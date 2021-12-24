//external imports
const express = require("express");

//internal imports
const { getInbox } = require("../controllers/inbox.controller");
const { checkLogin } = require("../middlewares/common/check-login.middleware");
const viewHandler = require("../middlewares/common/view-handler.middleware");

const inboxRoute = express.Router();

//login page
inboxRoute.get("/", viewHandler("Inbox"), checkLogin, getInbox);

module.exports = inboxRoute;
