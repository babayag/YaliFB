'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  // mongoose = require('mongoose'),
  // Course = mongoose.model('Course'),
  //errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  configAPI = require(path.resolve('./config/configApi')),
  request = require('superagent'),
 

  /*
   * @achilsowa
   *
   * Variable like apiKey should be define in the config and not in the code directly
   * so other methods and files can use the same and it case it change we only change that once
   * And the give config file should be ignore when pushing data
   * If the data is too important and critical, it must be move to an external file which is never pushed
   * The same for listId for now, which ideal should be configure directly from the user interface
  */
  listId = '10602946';

/*
 * @achilsowa
 *
 * This should be moved to another file !!!
 * It is not part of course module and can be use by other modules
 * already Done
 */

/**
 * save Suscriber
 */

exports.saveContact = function saveContact(data, callback) {

  var url = configAPI.mailerLite.urlGroup + listId + '/subscribers';
  request
    .post(url)
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('X-MailerLite-ApiKey', configAPI.mailerLite.apiKey)
    .send({
      'name': data.fullName,
      'email': data.email,
      '$daterdv': data.dateRdv,
      '$hourrdv': data.hourRdv,
      '$phone': data.phone,
      '$skypeid': data.skypeId,
      '$message': data.message
    })
    .end(function (err, response) {
      if (err) {
        return console.log(err);
      }

      if (response && (response.status < 300 || response.status === 409)) {
        return console.log(null, response);
      }
      return callback({
        error: true,
        message: "Error on mailerlite API call"
      });
    });
}

