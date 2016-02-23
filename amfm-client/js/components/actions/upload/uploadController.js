'use strict';

angular.module('amfm.actions')
    .controller('UploadController', ['$rootScope', '$scope', 'fs', 'AmfmEvents',
        function($rootScope, $scope, fs, AmfmEvents) {
            $scope.open = false;

            this.upload = function() {
                var done = false;
                fs.touch($scope.files, function(f, progress) {
                    f.progress = progress;
                    $scope.$apply(); //fixme:
                    if (!done && allDone()) { //prevent to double fired event
                        done = true;
                        $rootScope.$broadcast(AmfmEvents.FILES_UPLOADED, $scope.files);
                    }
                });
            };
            this.close = function() {
                $scope.open = false;
                delete $scope.files;
            };

            function allDone() {
                var done = true;
                for (var i = 0; i < $scope.files.length && done; i++) {
                    done = ($scope.files[i].progress === 100);
                }
                return done;
            }
        }]);