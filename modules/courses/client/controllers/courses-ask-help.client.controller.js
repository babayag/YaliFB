(function () {
    'use strict';
  
    angular
      .module('courses')
      .controller('CourseAskHelpController', CourseAskHelpController);
  
    CourseAskHelpController.$inject = ['$scope','RdvService' ,'Authentication','$http'];
  
    function CourseAskHelpController($scope , RdvService , Authentication, $http) {
          var vm = this;


          //$scope.course = course;
          $scope.authentication = Authentication;

          $scope.designCorrected = false;


          $scope.choiceOfplan = "";
          //$scope.loadRadiodate = loadRadiodate;
          $scope.arrOfdate = RdvService.loadRadiodate();

          /*
           * @achilsowa
           *
           * Service like variables that should be define in a service an injected there
           *
           * Already Done
           */
          $scope.HourRdv = RdvService.rdvhoursload();
          $scope.setChoiceOfPlan = setChoiceOfPlan;
          $scope.formParams = {};
          $scope.stage = "";
          $scope.formValidation = false;
          $scope.toggleJSONView = false;
          $scope.toggleFormErrorsView = false;
          $scope.next = next;
          $scope.back = back;
          $scope.submitForm = submitForm;
          $scope.reset = reset;

            /*
             * @achilsowa
             *
             * Prefere to affect all $scope method on top of the controller
             * This help you know at the begining which methods have been added to the scope
             *
             * ALREADY DONE
             *
             */

          $scope.formParams = {
            ccEmail: '',
            ccEmailList: []
          };

          // set the plan choice
          function setChoiceOfPlan(plan)
          {
             $scope.choiceOfplan = plan;
          }

          // Navigation functions
           function next (stage) {
            $scope.formValidation = true;

            if ($scope.multiStepForm.$valid) {
              $scope.direction = 1;
              $scope.stage = stage;
              $scope.formValidation = false;
            }
          }

          function back (stage) {
            $scope.direction = 0;
            $scope.stage = stage;
          }


          /*
           * @achilsowa
           *
           * Avoid to use $http directly in the controller
           * Perfer define a method to do the job in the service, and the call
           * that method from the controller
           * The controller should not be aware of how you get data, it make them more flexible
           * Already done
           */

          // Post to desired exposed web service.
           function submitForm () {
                RdvService.submitForm($scope.formParams);
           }

          function reset() {
            // Clean up scope before destorying
            $scope.formParams = {};
            $scope.stage = "";
          }
    }

    
  }());
  