/**
 * Author: Ashiqur Rahman
 * Description: Some important helper function
 * Date: 2021291213
 */

//dependencies
const crypto = require('crypto');
const environments = require('../helpers/environments');

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
    if(value && value.length>0){
        const encryptedVal = crypto.createHmac('sha256', environments.secretKey)
        .update(value)
        .digest('hex');
        return encryptedVal;
    }
    return false;
}

module.exports = utilities;
