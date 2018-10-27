(function () {
    'use strict';
  
    angular
      .module('courses')
      .controller('CourseAskHelpController', CourseAskHelpController);
  
    CourseAskHelpController.$inject = ['$scope','CoursesService' ,'Authentication','$http'];
  
    function CourseAskHelpController($scope , CoursesService , Authentication, $http) {
      var vm = this;
      
      
      //$scope.course = course;
      $scope.authentication = Authentication;
      //vm.test  = "lololl";
      $scope.choiceOfplan = "";
      //$scope.loadRadiodate = loadRadiodate;
      $scope.arrOfdate = loadRadiodate();
      $scope.HourRdv = ['02PM to 03PM','03PM to 04PM','04PM to 05PM','05PM to 06PM','06PM to 07PM','07PM to 08PM'];
      $scope.setChoiceOfPlan = setChoiceOfPlan;
      $scope.formParams = {};
      $scope.stage = "";
      $scope.formValidation = false;
      $scope.toggleJSONView = false;
      $scope.toggleFormErrorsView = false;
      
      $scope.formParams = {
        ccEmail: '',
        ccEmailList: []
      };
      


      // set the date available for rdv

      function loadRadiodate()
      {
        var arr = new Array();
        var dt = new Date();
        var i = 0;
        while ( i < 5) {
            if(dt.getDay() === 0 || dt.getDay() === 6)
            {
                 dt.setDate(dt.getDate() + 1);
                 //i--;
            }
            else
              
            {
              arr.push(new Date(dt));
              dt.setDate(dt.getDate() + 1);
              i++;
            }
        }
        return arr;
      }

      // set the plan choice

      function setChoiceOfPlan(plan)
      {
         $scope.choiceOfplan = plan;
      }
      // Navigation functions
      $scope.next = function (stage) {
        //$scope.direction = 1;
        //$scope.stage = stage;
        
        $scope.formValidation = true;
        
        if ($scope.multiStepForm.$valid) {
          $scope.direction = 1;
          $scope.stage = stage;
          $scope.formValidation = false;
        }
      };
    
      $scope.back = function (stage) {
        $scope.direction = 0;
        $scope.stage = stage;
      };
      
     /*  // CC email list functions
      $scope.addCCEmail = function () {
        $scope.rowId++;
    
        var email = {
          email: $scope.formParams.ccEmail,
          row_id: $scope.rowId
        };
    
        $scope.formParams.ccEmailList.push(email);
    
        $scope.formParams.ccEmail = '';
      }; */
    
      /* $scope.removeCCEmail = function (row_id) {
        for (var i = 0; i < $scope.formParams.ccEmailList.length; i++) {
          if ($scope.formParams.ccEmailList[i].row_id === row_id) {
            $scope.formParams.ccEmailList.splice(i, 1);
            break;
          }
        }
      }; */
      
      
      // Post to desired exposed web service.
      $scope.submitForm = function () {
       var wsUrl = "/api/saveSuscriber";
    
        // Check form validity and submit data using $http
       //if ($scope.multiStepForm.$valid) {
          //$scope.formValidation = false;
          $http({
            method: 'POST',
            url: wsUrl,
            data: JSON.stringify($scope.formParams)
          }).then(function successCallback(response) {
            if (response
              && response.data
              && response.data.status
              && response.data.status === 'success') {
              $scope.stage = "success";
            } else {
              if (response
                && response.data
                && response.data.status
                && response.data.status === 'error') {
                $scope.stage = "error";
              }
            }
          }, function errorCallback(response) {
            $scope.stage = "error";
            console.log(response);
          });
        //}
       };
      
      $scope.reset = function() {
        // Clean up scope before destorying
        $scope.formParams = {};
        $scope.stage = "";
      }
    }
  }());
  