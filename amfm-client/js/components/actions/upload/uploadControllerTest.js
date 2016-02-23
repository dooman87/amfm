'use strict';

describe('UploadController', function() {
    var $scope;
    var uploadController;
    var amfmEvents;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, AmfmEvents) {
        $scope = $rootScope.$new();
        amfmEvents = AmfmEvents;
        var fs = {
            touch: function(files, progressFn) {
                if (angular.isArray(files) && files.length) {
                    angular.forEach(files, function(f) {
                        progressFn(f, 100);
                    });
                }
            }
        };
        uploadController = $controller('UploadController', {$scope: $scope, fs: fs});
    }));

    it('should create "UploadController"', inject(function() {
        expect(uploadController).toBeDefined();
    }));

    it('upload panel should be closed by default', inject(function() {
        expect($scope.open).toBe(false);
    }));

    it('files should be undefined by default', inject(function() {
        expect($scope.files).toBeUndefined();
    }));

    it('close() function should reset $scope.open property', inject(function() {
        $scope.open = true;
        uploadController.close();
        expect($scope.open).toBe(false);
    }));

    it('close() function should reset $scope.files property', inject(function() {
        $scope.files = [];
        uploadController.close();
        expect($scope.files).toBeUndefined();
    }));

    it('upload() function should fire FILES_UPLOADED event at the end', inject(function() {
        var fired = false;
        $scope.$on(amfmEvents.FILES_UPLOADED, function(evt) {
            fired = true;
        });
        $scope.files = [{}];
        uploadController.upload();
        expect(fired).toBe(true);
    }));

    it('upload() function should fire FILES_UPLOADED event at the end only once', inject(function() {
        var fired = 0;
        $scope.$on(amfmEvents.FILES_UPLOADED, function(evt) {
            fired++;
        });
        $scope.files = [{}, {}, {}];
        uploadController.upload();
        expect(fired).toBe(1);
    }));
});
