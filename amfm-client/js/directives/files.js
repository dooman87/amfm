angular.module('amfm')
.directive('amfmFiles', [function() {
        function link(scope, element, attrs) {
            element.on('change', function() {
                scope[attrs.amfmFiles] = this.files;
                scope.$apply();
            });
            scope.$watch(attrs.amfmFiles, function() {
                if (!scope[attrs.amfmFiles]) {
                    element.val([]);
                }
            });
        }

        return {
            link: link
        };
    }]);