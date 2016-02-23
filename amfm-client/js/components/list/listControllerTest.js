'use strict';

describe('ListController', function() {
    var $scope;
    var listController;
    var amfmEvents;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, AmfmEvents) {
        $scope = $rootScope.$new();
        amfmEvents = AmfmEvents;
        listController = $controller('ListController', {$scope: $scope});
    }));

    it('ListController: should create "ListController"', inject(function() {
        expect(listController).toBeDefined();
    }));

    it('should call refresh when FILES_UPLOADED fired', inject(function() {
        spyOn(listController, 'refresh');
        $scope.$emit(amfmEvents.FILES_UPLOADED, [{}]);
        expect(listController.refresh).toHaveBeenCalled();
    }));

    it('should call refresh when DIR_CREATED fired', inject(function() {
        spyOn(listController, 'refresh');
        $scope.$emit(amfmEvents.DIR_CREATED);
        expect(listController.refresh).toHaveBeenCalled();
    }));

    //TODO: test for undefined path.
});
