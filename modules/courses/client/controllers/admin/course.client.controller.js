(function () {
  'use strict';

  angular
    .module('courses.admin')
    .controller('CoursesAdminController', CoursesAdminController);

  CoursesAdminController.$inject = ['$scope', '$state', '$window', 'courseResolve', 'Authentication', 'Notification'];

  function CoursesAdminController($scope, $state, $window, course, Authentication, Notification) {
    var vm = this;

    vm.course = course;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Course
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.course.$remove(function () {
          $state.go('admin.courses.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Course deleted successfully!' });
        });
      }
    }

    // Save Course
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      // Create a new course, or update the current instance
      vm.course.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.courses.list'); // should we send the User to the list or the updated Course's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Course saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Course save error!' });
      }
    }
  }
}());
