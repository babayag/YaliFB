'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  course;

/**
 * Course routes tests
 */
describe('Course Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new course
    user.save()
      .then(function () {
        course = {
          title: 'Course Title',
          content: 'Course Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an course if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Get a list of courses
            agent.get('/api/courses')
              .end(function (coursesGetErr, coursesGetRes) {
                // Handle course save error
                if (coursesGetErr) {
                  return done(coursesGetErr);
                }

                // Get courses list
                var courses = coursesGetRes.body;

                // Set assertions
                (courses[0].user._id).should.equal(userId);
                (courses[0].title).should.match('Course Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an course if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Update course title
            course.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing course
            agent.put('/api/courses/' + courseSaveRes.body._id)
              .send(course)
              .expect(200)
              .end(function (courseUpdateErr, courseUpdateRes) {
                // Handle course update error
                if (courseUpdateErr) {
                  return done(courseUpdateErr);
                }

                // Set assertions
                (courseUpdateRes.body._id).should.equal(courseSaveRes.body._id);
                (courseUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an course if no title is provided', function (done) {
    // Invalidate title field
    course.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new course
        agent.post('/api/courses')
          .send(course)
          .expect(422)
          .end(function (courseSaveErr, courseSaveRes) {
            // Set message assertion
            (courseSaveRes.body.message).should.match('Title cannot be blank');

            // Handle course save error
            done(courseSaveErr);
          });
      });
  });

  it('should be able to delete an course if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Delete an existing course
            agent.delete('/api/courses/' + courseSaveRes.body._id)
              .send(course)
              .expect(200)
              .end(function (courseDeleteErr, courseDeleteRes) {
                // Handle course error error
                if (courseDeleteErr) {
                  return done(courseDeleteErr);
                }

                // Set assertions
                (courseDeleteRes.body._id).should.equal(courseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single course if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new course model instance
    course.user = user;
    var courseObj = new Course(course);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Get the course
            agent.get('/api/courses/' + courseSaveRes.body._id)
              .expect(200)
              .end(function (courseInfoErr, courseInfoRes) {
                // Handle course error
                if (courseInfoErr) {
                  return done(courseInfoErr);
                }

                // Set assertions
                (courseInfoRes.body._id).should.equal(courseSaveRes.body._id);
                (courseInfoRes.body.title).should.equal(course.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (courseInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Course.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
