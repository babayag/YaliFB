(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CoursesController', CoursesController);

  CoursesController.$inject = ['$scope', 'courseResolve', 'Authentication'];

  function CoursesController($scope, course, Authentication) {
    var vm = this;

    vm.course = course;
    vm.authentication = Authentication;

  }
}());
