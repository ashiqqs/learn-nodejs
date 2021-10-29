/**
 * Author: Ashiqur Rahman
 * Description: Some important helper function
 * Date: 2021291213
 */

//dependencies
const crypto = require("crypto");
const environments = require("../helpers/environments");

const utilities = {};

utilities.parseJson = (textObj) => {
  let obj;
  try {
    obj = JSON.parse(textObj);
  } catch {
    obj = {};
  }
  return obj;
};

utilities.hash = (value) => {
  if (value && value.length > 0) {
    const encryptedVal = crypto
      .createHmac("sha256", environments.secretKey)
      .update(value)
      .digest("hex");
    return encryptedVal;
  }
  return false;
};

utilities.getRandomStr = (length) => {
  const strLen = typeof length === "number" && length > 0 ? length : false;
  let randomStr = '';
  if(length){
    const a2z0to9 = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0; i<strLen; i++){
      const randomChar = a2z0to9.charAt(Math.floor(Math.random() * a2z0to9.length));
      randomStr += randomChar;
    }
  }
  return randomStr;
};

module.exports = utilities;
