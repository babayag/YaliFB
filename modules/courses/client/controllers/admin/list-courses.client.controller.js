(function () {
  'use strict';

  angular
    .module('courses.admin')
    .controller('CoursesAdminListController', CoursesAdminListController);

  CoursesAdminListController.$inject = ['CoursesService'];

  function CoursesAdminListController(CoursesService) {
    var vm = this;

    vm.courses = CoursesService.query();
  }
}());
