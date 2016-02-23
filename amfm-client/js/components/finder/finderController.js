'use strict';

angular.module('amfm.controllers')
    .controller('FinderController', ['$rootScope', '$scope', 'fs', 'AmfmEvents',
        function($rootScope, $scope, fs, AmfmEvents) {

            var self = this;

            $scope.$on(AmfmEvents.FILES_UPLOADED, function(event, newFiles) {
                if (newFiles && newFiles.length) {
                    self.refresh();
                }
            });
            $scope.$on(AmfmEvents.DIR_CREATED, function(event, dirName) {
                self.refresh();
            });
            $scope.$on(AmfmEvents.FILES_DELETED, function (evt) {
                self.refresh();
            });

            $scope.root = '';
            $scope.currentPath = '';
            $scope.path = [];
            $scope.selection = [];

            this.changeDir = function(dir, idx) {
                if (!idx) {
                    $scope.root = dir;
                }
                $scope.currentPath = dir;
                fs.cd('/' + dir);
                self.refresh(idx);
            };
            this.refresh = function(idx) {
                $scope.previewUrl = null;
                $scope.selection = [];
                $rootScope.$broadcast(AmfmEvents.SELECTION_CHANGED);

                if (angular.isUndefined(idx)) {
                    idx = $scope.path.length - 1;
                }
                fs.ls().then(function(response) {
                    if (!$scope.path[idx]) {
                        $scope.path.push({files: response.data});
                    } else {
                        $scope.path[idx].files = response.data;
                    }
                    $scope.path.splice(idx + 1);
                });
            };

            this.select = function(file) {
                if (file.selected) {
                    $scope.selection.push(file.fullPath);
                } else {
                    $scope.selection.splice($scope.selection.indexOf(file.fullPath), 1);
                }
                $rootScope.$broadcast(AmfmEvents.SELECTION_CHANGED, $scope.selection);
            };

            this.preview = function(file, idx) {
                self.changeDir(file.fullPath.substr(0, file.fullPath.lastIndexOf('/')), idx);
                $scope.previewUrl = '/f' + file.fullPath;
            };

            if (!$scope.amfmStartPath) {
                $scope.amfmStartPath = '/';
            } else {
                self.changeDir($scope.amfmStartPath, 0); //Var already was changed
            }
            $scope.$on(AmfmEvents.RESET_PATH, function(evt, path) {
                self.changeDir(path, 0);
            });

            if (!$scope.preventFileLoad) {
                this.changeDir($scope.amfmStartPath, 0);
            }
        }]);