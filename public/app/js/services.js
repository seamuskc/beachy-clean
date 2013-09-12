'use strict';

/* Services */

var app = angular.module('beachyCleanAppServices', ['ngResource']);

app.factory('Users', function($resource) {
        return $resource('/users/:id');
    }
);

app.factory('AuthService', function($http){
    
    var authService = {};
    
    authService.currentUser = '';
    
    authService.isAuthenticated = function(){
        return (this.currentUser !== '');  
    };
    
    authService.logOut = function(){
        this.currentUser = '';
    };
    
    authService.setCurrentUser = function(usr) {
        this.currentUser = usr;
    }
    
    authService.login = function(userName, password, success, error) {
        
        $http.post('/login', {username:userName, password:password})
            .success(function(resp){
                authService.setCurrentUser(resp);
                success(resp);
            })
            .error(function(resp){
                error(resp);
            })
        
    };
    
    authService.isPublic = function(url) {
        return ("partials/home.html" == url || "partials/register.html" == url);
    };
    
    return authService;
    
    
});
