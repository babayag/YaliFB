'use strict';

/**
 * Module dependencies
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller'),
  conctat = require('../controllers/courses-ask-help.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  /*
   * @achilsowa
   *
   * Should add policy for file upload and save subscriber
   * 
   */ 
  app.route('/api/users/fileupload').post(courses.storePdfWorksheet);


  // Single article routes
  app.route('/api/courses/:courseId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);
  // register the suscriber and the offer

  app.route('/api/saveSuscriber').post(conctat.saveContact);

  // Finish by binding the article middleware
  app.param('courseId', courses.courseByID);

  
};
