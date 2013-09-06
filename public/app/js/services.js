'use strict';

/* Services */

var app = angular.module('beachyCleanAppServices', ['ngResource']);

app.factory('Users', function($resource) {
        return $resource('/users/:id');
    }
);

app.factory('AuthService', function($http){
    
    return {
        
        login : function(userName, password, success, error) {
            
            $http.post('/login', {username:userName, password:password})
                .success(function(resp){
                    success(resp);
                })
                .error(function(resp){
                    error(resp);
                })
        }
    };
    
});
