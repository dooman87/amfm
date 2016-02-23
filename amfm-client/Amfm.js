'use strict';

angular.module('amfm.data', []);
angular.module('amfm.controllers', []);

// Declare app level module
angular.module('amfm', [
    'amfm.actions',
    'amfm.controllers',
    'amfm.data'
])
.value('AmfmEvents', {
        FILES_UPLOADED:     'AMFM_FILES_UPLOADED',
        FILES_DELETED:      'AMFM_FILES_DELETED',
        DIR_CREATED:        'AMFM_DIR_CREATED',
        SELECTION_CHANGED:  'AMFM_SELECTION_CHANGED',
        RESET_PATH:         'AMFM_RESET_PATH'
    });
