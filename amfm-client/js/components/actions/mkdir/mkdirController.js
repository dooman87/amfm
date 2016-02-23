'use strict';

angular.module('amfm.actions')
    .controller('MkdirController', ['$rootScope', '$scope', 'fs', 'AmfmEvents',
        function($rootScope, $scope, fs, AmfmEvents) {
            var self = this;

            this.reset = function() {
                $scope.showForm = false;
                $scope.dirName = '';
            };

            this.createDir = function(dirName) {
                if (dirName) {
                    fs.mkdir(dirName).then(function(response) {
                        self.reset();
                        $rootScope.$broadcast(AmfmEvents.DIR_CREATED, dirName);
                    });
                }
            };

            self.reset();
        }]);