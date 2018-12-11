/* 
  * @achilsowa
  * 
  * Always handle error case in your callbacks
  * 
  *  
*/
(function () {
  'use strict';

  angular
    .module('courses.admin')
    .controller('ModalAdminController', ModalAdminController);

  ModalAdminController.$inject = ['$scope', '$state', '$window', '$uibModalStack', 'course', 'Authentication', 'Notification'];

  function ModalAdminController($scope, $state, $window, $uibModalStack, course, Authentication, Notification) {
    var vm = this;

    vm.course = course;
    vm.remove = remove;


    // Remove existing Course
    function remove() {
      vm.course.$remove(function () {
        $state.transitionTo('admin.courses.list');
        $uibModalStack.dismissAll();
        Notification.success({ message: '<i class="glyphicon glyphicon-ok" ></i> has been deleted successfully!' });
      });
    }

    $scope.cancel = function () {
      $uibModalStack.dismissAll();
    };
  }
}());
