'use strict';

angular.module('amfm.data')
    .factory('fs', ['$http', '$q',
    function($http, $q) {
        function uploadFile(path, file, progressCb) {
            var reader = new FileReader();
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable) {
                    progressCb( file, Math.round((e.loaded * 100) / e.total) );
                }
            }, false);

            xhr.upload.addEventListener("load", function(e) {
                progressCb(file, 100);
            }, false);
            var cleanPath = normalize(path + "/" + file.name);
            xhr.open("POST", "/fs/touch" + cleanPath);
            xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
            reader.onloadend = function(evt) {
                xhr.send(evt.target.result);
            };
            reader.readAsArrayBuffer(file);
        }

        function normalize(path) {
            path = path.replace(/[\/]+/, '/');
            return path === '/' ? '' : path;
        }

        var currentPath = [];
        var fsImpl = {
            ls: function() {
                return $http.get('/fs/ls' + fsImpl.pwd());
            },
            touch: function(files, progressCb) {
                for (var i = 0; i < files.length; i++) {
                    uploadFile(fsImpl.pwd(), files[i], progressCb);
                }
            },
            cd: function(to) {
                to = normalize(to);
                if (to === '') {
                    currentPath = [''];
                } else if (to[0] === '/') {
                    currentPath = to.split('/');
                } else if (to === '..' && currentPath.length > 0) {
                    currentPath.pop();
                } else {
                    currentPath.push(to);
                }
            },
            pwd: function() {
                var result = '';
                for (var i = 0; i < currentPath.length; i++) {
                    result += currentPath[i] + '/'
                }
                return result;
            },
            mkdir: function(dirName) {
                var path = normalize(fsImpl.pwd() + '/' + dirName);
                return $http.post('/fs/mkdir' + path);
            },
            rm: function (files) {
                var defer = $q.defer();
                if (angular.isArray(files) && files.length) {
                    var cntr = files.length;

                    angular.forEach(files, function(f) {
                        var path = normalize(f);
                        $http.post('/fs/rm' + path).then(
                            function () {
                                cntr--;
                                if (cntr === 0) {
                                    defer.resolve();
                                }
                            },
                            function () {
                                console.error('Error while remove file');
                                cntr--;
                                if (cntr === 0) {
                                    defer.resolve();
                                }
                            }
                        );
                    });
                } else {
                    defer.resolve();
                }
                return defer.promise;
            }
        };
        return fsImpl;
    }]);