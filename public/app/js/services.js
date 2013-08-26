'use strict';

/* Services */

angular.module('beachyCleanAppServices', ['ngResource']).
    factory('User', function($resource){
        return $resource('/user/:id');
});





