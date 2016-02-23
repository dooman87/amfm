'use strict';

angular.module('amfm').config(['ActionsProvider', function(ActionsProvider) {
    ActionsProvider.
        register(
        {
            template: 'js/components/actions/mkdir/mkdir.html'
        }
    ).
        register(
        {
            template: 'js/components/actions/upload/upload.html'
        }
    ).
        register(
        {
            template: 'js/components/actions/rm/rm.html'
        }
    );
}]);


// Declare app level module
angular.module('amfmApp', [
    'ngRoute',
    'ngResource',
    'amfm'
]).
    config(['$routeProvider', 'ActionsProvider', function($routeProvider, ActionsProvider) {
        $routeProvider
            .when('/view/:type*', {
                templateUrl: function(types) {
                    return 'js/components/' + types.type + '/' + types.type + '.html';
                }
            })
            .otherwise({
                templateUrl: function(types) {
                    return 'js/components/list/list.html';
                }
            });
    }]);
