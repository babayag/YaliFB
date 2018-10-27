(function () {
  'use strict';

  angular
    .module('courses.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('courses.askHelp', {
      url: '/course-help',
      templateUrl: '/modules/courses/client/views/courses-ask-help.client.view.html',
      controller: 'CourseAskHelpController',
      controllerAs: 'vm'
    })
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('courses.list', {
        url: '',
        templateUrl: '/modules/courses/client/views/list-courses.client.view.html',
        controller: 'CourseListController',
        controllerAs: 'vm'
      })
      .state('courses.view', {
        url: '/:courseId',
        templateUrl: '/modules/courses/client/views/view-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          pageTitle: '{{ courseResolve.title }}'
        }
      })
     ;
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }
}());
