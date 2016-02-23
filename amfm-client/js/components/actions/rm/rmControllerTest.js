'use strict';

describe('rmController', function() {
    var $scope;
    var rmController;
    var amfmEvents;
    var bin;
    var confirmed = true;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, $q, AmfmEvents) {
        $scope = $rootScope.$new();
        amfmEvents = AmfmEvents;
        var $window = {
            confirm: function(str) {
                return confirmed;
            }
        };
        bin = [];
        var fs = {
            rm: function(files) {
                var defer = $q.defer();
                if (files) {
                    Array.prototype.push.apply(bin, files);
                }
                defer.resolve();
                return defer.promise;
            }
        };
        rmController = $controller('RmController',
            {
                $scope: $scope,
                $window: $window,
                fs: fs
            });
    }));

    it('should create "RmController"', inject(function() {
        expect(rmController).toBeDefined();
    }));

    it('selection should be undefined', inject(function () {
        expect($scope.selection).toBeUndefined();
    }));

    it('selection should be initialised on SELECTION_CHANGED event', inject(function () {
        $scope.$emit(amfmEvents.SELECTION_CHANGED, [{name: 'file1'}, {name: 'file2'}]);
        $scope.$apply();
        expect($scope.selection).toBeDefined();
        expect($scope.selection.length).toBe(2);
        expect($scope.selection[0].name).toBe('file1');
        expect($scope.selection[1].name).toBe('file2');
    }));

    it('should not throw error if selection undefined', inject(function () {
        rmController.delete();
    }));

    it('should add removed files to bin', inject(function () {
        $scope.selection = [{name: 'file1'}, {name: 'file2'}];
        rmController.delete();
        expect(bin.length).toBe(2);
    }));

    it('should broadcast FILES_DELETED event', inject(function () {
        var catched = false;
        $scope.$on(amfmEvents.FILES_DELETED, function (evt) {
            catched = true;
        });
        $scope.selection = [{name: 'file1'}, {name: 'file2'}];
        rmController.delete();
        $scope.$apply();
        expect(catched).toBe(true);
    }));

    it('should not remove files if operation was not confirmed', inject(function () {
        confirmed = false;
        $scope.selection = [{name: 'file1'}, {name: 'file2'}];
        rmController.delete();
        expect(bin.length).toBe(0);
    }));
});
