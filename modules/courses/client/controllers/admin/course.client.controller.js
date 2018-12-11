(function () {
  'use strict';

  angular
    .module('courses.admin')
    .controller('CoursesAdminController', CoursesAdminController);

  CoursesAdminController.$inject = ['$scope', '$state', '$window','$uibModal', 'courseResolve', 'Authentication', 'Notification', 'Upload'];

  function CoursesAdminController($scope, $state, $window, $uibModal, course, Authentication, Notification, Upload) {
    var vm = this;

    vm.course = course;
    vm.authentication = Authentication;
    vm.form = {};
    vm.form.courseForm = {};
      vm.generateFileName = generateFileName;
    vm.openModal = openModal;
    vm.save = save;

    // Remove existing Course
    function openModal() {
      var modal = $uibModal.open({
        templateUrl: '/modules/courses/client/views/admin/modal.client.view.html',
        controller: 'ModalAdminController',
        controllerAs: 'vm',
        backdrop: true, 
        size: 'md',
        resolve: {
            course: 
            function () {
              return vm.course
          }
      },
      windowClass: "animated fadeInY"
  });
    }


    function generateFileName(initialFile) {

      var initialFileName, fileExtension;
      var fileName = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 30; i++)
          fileName += possible.charAt(Math.floor(Math.random() * possible.length));

      initialFileName = initialFile ;
      fileExtension = initialFileName.replace(/^.*\./, '');

      return fileName+"."+fileExtension;
  }


  vm.upload = function (file) {
      if(!file) return false;
      var newFileName = generateFileName(file.name);
      file = Upload.rename(file, newFileName);

      console.log(file);

      Upload.upload({
          url: '/api/users/fileupload',      //webAPI exposed to upload the file
          data: {file: file}  //pass file as data, should be user ng-model
      });


      var finalResult = "/modules/courses/client/img/pdfWorksheet/" + newFileName;
      console.log(vm.course);
      vm.course.Worksheet = finalResult;  // set the value of worksheet as a string made of the pathto the file and the new generated file name
      console.log(vm.course);


  };


  
    // Save Course
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }
      
      vm.upload(vm.file); //call upload function

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
