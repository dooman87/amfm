'use strict';

describe('FinderController', function() {
    var $scope;
    var finderController;
    var amfmEvents;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, AmfmEvents) {
        $scope = $rootScope.$new();
        finderController = $controller('FinderController', {$scope: $scope});
        amfmEvents = AmfmEvents;
    }));

    it('FinderController: should create "FinderController"', inject(function() {
        expect(finderController).toBeDefined();
    }));

    it('refresh() should reset selection', inject(function() {
        $scope.selection = [{filename: 'abc.txt'}];
        finderController.refresh();
        expect($scope.selection).toBeDefined();
        expect($scope.selection.length).toBe(0);
    }));

    it('should call refresh when FILES_UPLOADED fired', inject(function() {
        spyOn(finderController, 'refresh');
        $scope.$emit(amfmEvents.FILES_UPLOADED, [{}]);
        expect(finderController.refresh).toHaveBeenCalled();
    }));

    it('should call refresh when DIR_CREATED fired', inject(function() {
        spyOn(finderController, 'refresh');
        $scope.$emit(amfmEvents.DIR_CREATED);
        expect(finderController.refresh).toHaveBeenCalled();
    }));

    it('should call refresh when FILES_DELETED fired', inject(function() {
        spyOn(finderController, 'refresh');
        $scope.$emit(amfmEvents.FILES_DELETED);
        expect(finderController.refresh).toHaveBeenCalled();
    }));

    it('should call changeDir when RESET_PATH fired', inject(function() {
        spyOn(finderController, 'changeDir');
        $scope.$emit(amfmEvents.RESET_PATH);
        expect(finderController.changeDir).toHaveBeenCalled();
    }));
});
