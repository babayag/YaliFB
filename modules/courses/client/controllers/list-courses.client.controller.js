(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CourseListController', CourseListController);

  CourseListController.$inject = ['CoursesService'];

  function CourseListController(CoursesService) {
    var vm = this;

    vm.courses = CoursesService.query();
  }
}());
