'use strict';

describe('MkdirController', function() {
    var $scope;
    var mkdirController;
    var amfmEvents;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, $q, AmfmEvents) {
        $scope = $rootScope.$new();
        amfmEvents = AmfmEvents;

        var defer = $q.defer();
        defer.resolve({});
        var fs = {
            mkdir: function(dirName) {}
        };
        spyOn(fs, 'mkdir').andReturn(defer.promise);
        mkdirController = $controller('MkdirController', {$scope: $scope, fs: fs});
    }));

    it('should create "MkdirController"', inject(function() {
        expect(mkdirController).toBeDefined();
    }));

    it('should hide form', inject(function() {
        expect($scope.showForm).toBe(false);
    }));

    it('should reset name of new folder', inject(function() {
        expect($scope.dirName).toBe('');
    }));

    it('should close form when dir was created', inject(function() {
        $scope.showForm = true;
        createDir();
        expect($scope.showForm).toBe(false);
    }));

    it('should clear text box when dir was created', inject(function() {
        $scope.showForm = true;
        createDir();
        expect($scope.dirName).toBe('');
    }));

    it('should send NEW_DIR event', inject(function() {
        var evtFired = false;
        var dirNameInEvent;
        $scope.$on(amfmEvents.DIR_CREATED, function(evt, dirName) {
            evtFired = true;
            dirNameInEvent = dirName;

        });
        $scope.showForm = true;
        createDir();
        expect(evtFired).toBe(true);
        expect(dirNameInEvent).toBe('abc');
    }));

    function createDir() {
        mkdirController.createDir('abc');
        $scope.$apply();
    }

    //TODO: ERRORS
});
