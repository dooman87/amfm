'use strict';

describe('fs', function() {
    var fsFac;

    beforeEach(module('amfm', function($provide) {
        $provide.value('$log', console);
    }));
    beforeEach(inject(function($rootScope, fs) {
        fsFac = fs;
    }));

    it('should create "fs" factory', inject(function() {
        expect(fsFac).toBeDefined();
    }));

    it('should do cd for relative paths correctly', inject(function() {
        fsFac.cd('');
        var pwd = fsFac.pwd();
        expect(pwd).toBeDefined();
        expect(pwd).toBe('/');

        fsFac.cd('Documents');
        pwd = fsFac.pwd();
        expect(pwd).toBe('/Documents/');

        fsFac.cd('Books');
        pwd = fsFac.pwd();
        expect(pwd).toBe('/Documents/Books/');
    }));

    it('should do cd for absolute paths correctly', inject(function() {
        fsFac.cd('/Documents/Books');
        var pwd = fsFac.pwd();
        expect(pwd).toBeDefined();
        expect(pwd).toBe('/Documents/Books/');

        fsFac.cd('/');
        pwd = fsFac.pwd();
        expect(pwd).toBe('/');
    }));
});
