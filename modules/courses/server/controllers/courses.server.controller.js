'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  request = require('superagent'),
  multer = require('multer'),

  /*
   * @achilsowa
   *
   * Variable like apiKey should be define in the config and not in the code directly
   * so other methods and files can use the same and it case it change we only change that once
   * And the give config file should be ignore when pushing data
   * If the data is too important and critical, it must be move to an external file which is never pushed
   * 
   * The same for listId for now, which ideal should be configure directly from the user interface
  */
  apiKey = "9e2b6b2b6cf8a4d693c3c5b0c7956722",
  listId = "10602946";


/**
 * Create a course
 */
exports.create = function (req, res) {
  var course = new Course(req.body);
  course.user = req.user;

  /* 
   * @achilsowa
   *
   * Even though mean does not use it by default, prefere a library like status to define statuses
   * using their name instead of the final code
   * It is more expressive on what you want to return
   * 
  */
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
 * Store pdf worksheet  of a course
 */

/* 
 * @achilsowa
 * 
 * Define a global method for uploading file, and another one to store worksheet
 * This will avoid repetition when you need to save some other file in your course
 * 
 */
exports.storePdfWorksheet = function (req, res) {  //console.log(res);

  /* 
   * Do we communicate to the user in case of error while uploading the worksheet ?
   *
  */
  var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      /*       
       * @achilsowa
       * 
       * Perfere a general destination like public/files to old user uploads
       * /client/image folder is meant for static files used by the module 
       * just like the file thumbnail.jpg
       */
      cb(null, './modules/courses/client/img/pdfWorksheet/');
    },
    filename: function (req, file, cb) {

      var fileName = file.originalname;
      console.log(fileName);

      cb(null, fileName);

    }


  });

  var upload = multer({ //multer settings
    storage: storage
  }).single('file');

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      //res.json({error_code:1,err_desc:err});
      return false;
    }
    //res.json({error_code:0,err_desc:null});
    return true;
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

/*       
 * @achilsowa
 * 
 * This should be moved to another file !!!
 * It is not part of course module and can be use by other modules
 */

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
