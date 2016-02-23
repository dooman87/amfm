'use strict';

angular.module('amfm.actions')
    .controller('ActionsPanelController', ['$scope', 'Actions', 'AmfmEvents',
        function ($scope, Actions, AmfmEvents) {
            var self = this;

            $scope.$on(AmfmEvents.SELECTION_CHANGED, function(event, selection) {
                self.actionsChanged(selection);
            });

            $scope.actions = Actions;

            this.actionsChanged = function(selection) {
            };
        }]);