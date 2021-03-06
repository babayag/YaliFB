﻿(function () {
  'use strict';

  describe('Courses Route Tests', function () {
    // Initialize global variables
    var $scope,
      CoursesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CoursesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CoursesService = _CoursesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.courses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/courses');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.courses.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/courses/client/views/admin/list-courses.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CoursesAdminController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.courses.create');
          $templateCache.put('/modules/courses/client/views/admin/form-course.client.view.html', '');

          // Create mock course
          mockCourse = new CoursesService();

          // Initialize Controller
          CoursesAdminController = $controller('CoursesAdminController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/courses/create');
        }));

        it('should attach an course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
          expect($scope.vm.course._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/courses/client/views/admin/form-course.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CoursesAdminController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.courses.edit');
          $templateCache.put('/modules/courses/client/views/admin/form-course.client.view.html', '');

          // Create mock course
          mockCourse = new CoursesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Course about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CoursesAdminController = $controller('CoursesAdminController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:courseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            courseId: 1
          })).toEqual('/admin/courses/1/edit');
        }));

        it('should attach an course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/courses/client/views/admin/form-course.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
