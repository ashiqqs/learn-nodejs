/**
 * Author: Ashiqur Rahman
 * Description: Notification related function
 * Date: 202110300956
 */

//dependencies
const https = require("https");
const { twilio } = require("./environments");
const queryString = require("node:querystring");
const { HTTP_STATUS } = require("./helper.enums");

const notifier = {};

notifier.sendSMS = (mobileNo, message, callback) => {
  const userMobileNo =
    typeof mobileNo === "string" && mobileNo.length == 11 ? mobileNo : false;
  const usersMsg =
    typeof message === "string" && message.length <= 1600 ? message : false;

  if (userMobileNo && usersMsg) {
    const payload = {
      From: `${twilio.fromMobileNo}`,
      To: userMobileNo,
      Body: usersMsg,
    };
    const payloadStr = queryString.stringify(payload);
    const reqInfo = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const req = https.request(reqInfo, (res) => {
      if (res.statusCode === HTTP_STATUS.OK || res.statusCode === 201) {
        callback(false);
      } else {
        callback("Twilio returned status " + res.statusCode);
      }
    });
    req.on("error", (e) => {
      callback(e);
    });
    req.write(payloadStr);
    req.end();
  } else {
    callback("Invalid mobileNo or message.");
  }
};

module.exports = notifier;
