'use strict';

describe('actionsPanelController', function() {
    var $scope;
    var actionsPanelController;
    var amfmEvents;

    beforeEach(module('amfm'));
    beforeEach(inject(function($rootScope, $controller, AmfmEvents) {
        $scope = $rootScope.$new();
        amfmEvents = AmfmEvents;
        actionsPanelController = $controller('ActionsPanelController', {$scope: $scope});
    }));

    it('should create "ActionsPanelController"', inject(function() {
        expect(actionsPanelController).toBeDefined();
    }));

    it('actions should be changed from selection', inject(function() {
        var changedFile;
        spyOn(actionsPanelController, 'actionsChanged').andCallFake(function(file) {
            changedFile = {name: 'f.txt'};
        });
        $scope.$emit(amfmEvents.SELECTION_CHANGED, {name: 'f.txt'});

        expect(changedFile).toBeDefined();
        expect(changedFile.name).toBe('f.txt');
    }));
});
