'use strict';

/**
 * Module dependencies
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  // Single article routes
  app.route('/api/courses/:courseId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);
  // register the suscriber and the offer

  app.route('/api/saveSuscriber').post(courses.saveContact);

  // Finish by binding the article middleware
  app.param('courseId', courses.courseByID);

  
};
