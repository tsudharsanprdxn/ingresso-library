/*!
 * Status
 * develop by PRDXN
 *
 *
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var request = require('superagent');
var moment = require('moment');
var dataMapping = require('./data-mapping.json');
var conf = require('./config');
var config = conf.getInstance();

/**
 * Module exports.
 * @public
 */

module.exports = Status;

function Status() {
  if (!(this instanceof Status))
    return new Status();
}

/**
 * Get the status of ingresso transaction
 *
 * @param String transaction_uuid
 * @return {Promise}
 * @public
 */

Status.prototype.getTransactionStatus = function (transaction_uuid) {
  return new Promise(function (resolve, reject) {
    try {
      var alise = 'status.v1';
      var url = config.data.url + alise + '/';

      var params = {
        transaction_uuid
      };

      var output = {
        "status": "",
        "error": 0,
        "message": "",
        "data": {
          "meta": {},
          "results": {}
        }
      };
      if (!transaction_uuid) {
        output.status = 10003;
        output.error = 1;
        output.message = "transaction_uuid is missing";
        reject(output);
      } else {
        request
          .get(url)
          .query(params)
          .set('Accept', 'application/json')
          .auth(config.data.user, config.data.password)
          .end(function (err, res) {
            if (err) {
              output.status = err.errno;
              output.error = 1;
              reject(output);
            } else {
              output.data.results = JSON.parse(res.text);
              resolve(output);
            }
          });
      }
    } catch (error) {
      reject(error);
    }
  });
}
