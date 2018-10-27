(function () {
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
          mainstate = $state.get('courses');
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
          liststate = $state.get('courses.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/courses/client/views/list-courses.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CoursesController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('courses.view');
          $templateCache.put('/modules/courses/client/views/view-course.client.view.html', '');

          // create mock course
          mockCourse = new CoursesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Course about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CoursesController = $controller('CoursesController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:courseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            courseId: 1
          })).toEqual('/courses/1');
        }));

        it('should attach an course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/courses/client/views/view-course.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/courses/client/views/list-courses.client.view.html', '');

          $state.go('courses.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('courses/');
          $rootScope.$digest();

          expect($location.path()).toBe('/courses');
          expect($state.current.templateUrl).toBe('/modules/courses/client/views/list-courses.client.view.html');
        }));
      });
    });
  });
}());
