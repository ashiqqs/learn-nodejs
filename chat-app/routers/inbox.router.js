//external imports
const express = require("express");

//internal imports
const { getInbox } = require("../controllers/inbox.controller");
const viewHandler = require("../middlewares/common/view-handler.middleware");

const inboxRoute = express.Router();

//login page
inboxRoute.get("/", viewHandler("Inbox"), getInbox);

module.exports = inboxRoute;
