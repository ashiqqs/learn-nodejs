/*
 * Description: worker file
 * Author: Ashiqur Rahman
 * Date: 202110301245
 */

const { ENTITY } = require("../helpers/helper.enums");
const utilities = require("../helpers/utilities");
const db = require("./data");
const url = require("url");
const http = require("http");
const https = require("https");
const notifier = require("../helpers/notifire");

//dependencies

//app object - module scaffolding
const worker = {};

worker.collectChecks = () => {
  db.list(ENTITY.CHECKS, (listErr, checks) => {
    if (!listErr && checks.length > 0) {
      checks.forEach((checkId) => {
        db.read(ENTITY.CHECKS, checkId, (checkReadErr, checkData) => {
          if (!checkReadErr && checkData) {
            const checkObj = utilities.parseJson(checkData);
            worker.validateCheck(checkObj);
          } else {
            console.log(`Error occured on reading check ${checkId}`);
          }
        });
      });
    } else {
      console.log(listErr);
    }
  });
};

worker.validateCheck = (check) => {
  if (check && check.id) {
    modifiedCheck = { ...check };
    modifiedCheck.state =
      typeof check.state === "string" &&
      ["up", "down"].indexOf(check.state) > -1
        ? check.state
        : "down";
    modifiedCheck.lastChecked =
      typeof check.lastChecked === "number" && check.lastChecked > 0
        ? check.lastChecked
        : false;
    worker.performCheck(modifiedCheck);
  } else {
    console.log("Invalid check found.");
  }
};

worker.performCheck = (check) => {
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  let outcomeSent = false;

  const parsedUrl = url.parse(`${check.protocol}://${check.url}`, true);
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  const reqInfo = {
    protocol: check.protocol + ":",
    hostname: hostname,
    method: check.method.toUpperCase(),
    path: path,
    timeout: check.timeOutSec * 1000,
  };

  const useProtocol = check.protocol === "http" ? http : https;
  let req = useProtocol.request(reqInfo, (res) => {
    checkOutcome.responseCode = res.statusCode;
    if (!outcomeSent) {
      worker.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("error", (e) => {
    checkOutcome = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      worker.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("timeout", (e) => {
    checkOutcome = {
      error: true,
      value: "timeout",
    };
    if (!outcomeSent) {
      worker.processCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  req.end();
};

worker.processCheckOutcome = (check, checkOutcome) => {
  let state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    check.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? "up"
      : "down";

  let isNeedAlert = check.lastChecked && check.state !== state ? true : false;
  let updatedCheck = check;
  updatedCheck.state = state;
  updatedCheck.lastChecked = Date.now();

  db.update(ENTITY.CHECKS, check.id, updatedCheck, (updateCheckErr) => {
    if (!updateCheckErr) {
      if (isNeedAlert) {
        worker.alertCheckState(updatedCheck);
      } else {
        console.log(`Check ${check.id} state not changed.`);
      }
    } else {
      console.log(`Check status of ${check.id} update failed.`);
    }
  });
};

worker.alertCheckState = (check) => {
  let msg = `Alert: Your check for ${check.method.toUpperCase()} ${
    check.protocol
  }://${check.url} is currently ${check.state}.`;
  notifier.sendSMS(check.userMobileNo, msg, (err) => {
    if (!err) {
      console.log(msg);
    } else {
      console.log("Failed to sent alert");
      console.log(msg);
    }
  });
};

worker.init = () => {
  worker.collectChecks();

  setInterval(()=>{
      worker.collectChecks()
  },1000*5)
};

module.exports = worker;
