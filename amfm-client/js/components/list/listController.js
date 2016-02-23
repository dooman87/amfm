'use strict';

angular.module('amfm.controllers')
    .controller('ListController', ['$scope', 'fs', 'AmfmEvents',
        function($scope, fs, AmfmEvents) {

            var self = this;

            $scope.$on(AmfmEvents.FILES_UPLOADED, function(event, newFiles) {
                if (newFiles) {
                    self.refresh();
                }
            });
            $scope.$on(AmfmEvents.DIR_CREATED, function(event, dirName) {
                self.refresh();
            });

            this.changeDir = function(dir) {
                fs.cd(dir);
                self.refresh();
                $scope.path = fs.pwd();
            };
            this.refresh = function() {
                fs.ls().then(function(response) {
                    $scope.files = response.data;
                });
            };
            this.changeDir('');
        }]);