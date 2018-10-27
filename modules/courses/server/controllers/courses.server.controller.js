'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  request = require('superagent'),
  apiKey = "9e2b6b2b6cf8a4d693c3c5b0c7956722",
  listId = "10602946";


/**
 * Create an course
 */
exports.create = function (req, res) {
  var course = new Course(req.body);
  course.user = req.user;

  course.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Show the current course
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var course = req.course ? req.course.toJSON() : {};

  // Add a custom field to the Course, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Course model.
  course.isCurrentUserOwner = !!(req.user && course.user && course.user._id.toString() === req.user._id.toString());

  res.json(course);
};

/**
 * Update an course
 */
exports.update = function (req, res) {
  var course = req.course;

  course.title = req.body.title;
  course.content = req.body.content;
  course.Worksheet = req.body.Worksheet;
  course.videoLink = req.body.videoLink

  course.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Delete an course
 */
exports.delete = function (req, res) {
  var course = req.course;

  course.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * List of Courses
 */
exports.list = function (req, res) {
  Course.find().sort('-created').populate('user', 'displayName').exec(function (err, courses) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * 
 * 
 */

 exports.saveContact = function(req,res) {
    //console.log(req.body)
    saveContact(req.body);
 }
/**
 * save Suscriber
 */

function saveContact(data , callback) {
  
	var url = 'https://api.mailerlite.com/api/v2/groups/' + listId + '/subscribers';
	request
		.post(url)
		.set('Content-Type', 'application/json;charset=utf-8')
		.set('X-MailerLite-ApiKey', apiKey)
		.send({
			'name': data.fullName,
      'email': data.email,
      '$daterdv' : data.dateRdv,
      '$hourrdv': data.hourRdv,
      '$phone' : data.phone,
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

/**
 * Course middleware
 */
exports.courseByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Course is invalid'
    });
  }

  Course.findById(id).populate('user', 'displayName').exec(function (err, course) {
    if (err) {
      return next(err);
    } else if (!course) {
      return res.status(404).send({
        message: 'No course with that identifier has been found'
      });
    }
    req.course = course;
    next();
  });
};
