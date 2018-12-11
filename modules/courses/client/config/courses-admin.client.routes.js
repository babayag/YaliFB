 (function () {
  'use strict';

  angular
    .module('courses.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('admin.courses.list', {
        url: '',
        templateUrl: '/modules/courses/client/views/admin/list-courses.client.view.html',
        controller: 'CoursesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.courses.create', {
        url: '/create',
        templateUrl: '/modules/courses/client/views/admin/form-course.client.view.html',
        controller: 'CoursesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          courseResolve: newCourse
        }
      })
      .state('admin.courses.edit', {
        url: '/:courseId/edit',
        templateUrl: '/modules/courses/client/views/admin/form-course.client.view.html',
        controller: 'CoursesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ courseResolve.title }}'
        },
        resolve: {
          courseResolve: getCourse
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
}());
