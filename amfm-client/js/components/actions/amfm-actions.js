'use strict';

angular.module('amfm.actions', [])
    .provider('Actions', function ActionsProvider() {
        var actions = [];

        this.register = function(a) {
            actions.push(a);
            return this;
        };

        this.$get = [function ActionsFactory() {
            return angular.copy(actions);
        }];
    });