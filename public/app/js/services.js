'use strict';

/* Services */

var app = angular.module('beachyCleanAppServices', ['ngResource']);

app.factory('Users', function($resource) {
        return $resource('/users/:id');
    }
);
