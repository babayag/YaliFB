/**
 * Created by Dell on 11-Dec-18.
 */
(function () {
    'use strict';


    angular
        .module('courses.services')
        .factory('RdvService', RdvService);

        RdvService.$inject = ['$http'];

        function RdvService($http){

            var service = {
                rdvhoursload: rdvhoursload,
                loadRadiodate: loadRadiodate,
                submitForm: submitForm
            };

            return service;


            function rdvhoursload()
            {
                var rdvHours = ['02PM to 03PM','03PM to 04PM','04PM to 05PM','05PM to 06PM','06PM to 07PM','07PM to 08PM'];
                return rdvHours;
            }

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

            function submitForm (formParams) {
                var wsUrl = "/api/saveSuscriber";

                // Check form validity and submit data using $http
                //if ($scope.multiStepForm.$valid) {
                //$scope.formValidation = false;
                $http({
                    method: 'POST',
                    url: wsUrl,
                    data: JSON.stringify(formParams)
                }).then(function successCallback(response) {
                    if (response
                        && response.data
                        && response.data.status // @achilsowa NO needed
                        && response.data.status === 'success') {
                        console.log(response);
                    } else {
                        if (response
                            && response.data
                            && response.data.status // @achilsowa NO needed
                            && response.data.status === 'error') {
                            console.log(response);
                        }
                    }
                }, function errorCallback(response) {

                    console.log(response);
                });
            }
        }
}());
