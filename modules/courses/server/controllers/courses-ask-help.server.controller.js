'use strict';
 var apiKey = "9e2b6b2b6cf8a4d693c3c5b0c7956722",
  listId = "10602946";



exports.saveContact = function (req, res) {
  //console.log(req.body)
  saveContact(req.body);
}


/**
 * save Suscriber
 */
function saveContact(data, callback) {

  var url = 'https://api.mailerlite.com/api/v2/groups/' + listId + '/subscribers';
  request
    .post(url)
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('X-MailerLite-ApiKey', apiKey)
    .send({
      'name': data.fullName,
      'email': data.email,
      '$daterdv': data.dateRdv,
      '$hourrdv': data.hourRdv,
      '$phone': data.phone,
      '$skypeid': data.skypeId,
       listId: data.listId,
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