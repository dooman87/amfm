'use strict';

angular.module('amfm.actions')
    .controller('RmController', ['$rootScope', '$scope', '$window', 'fs', 'AmfmEvents',
        function ($rootScope, $scope, $window, fs, AmfmEvents) {
            var self = this;

            $scope.$on(AmfmEvents.SELECTION_CHANGED, function (evt, files) {
                $scope.selection = files;
            });

            this.delete = function () {
                if (angular.isArray($scope.selection) &&
                        $window.confirm('Are you sure that you want to delete ' + $scope.selection.length + ' objects?'))
                {
                    fs.rm($scope.selection).then(function (response) {
                        $rootScope.$broadcast(AmfmEvents.FILES_DELETED);
                    });
                }
            }
        }]);