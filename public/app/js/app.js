'use strict';

/* App Module */
angular.module('beachyCleanApp', ['beachyCleanAppFilters', 'beachyCleanAppServices', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users/list', {templateUrl: 'partials/user-list.html',   controller: UserListCtrl}).
      when('/user/:userId', {templateUrl: 'partials/user-detail.html', controller: UserDetailCtrl}).
      when('/register', {templateUrl: 'partials/register.html', controller: UserRegistrationCtrl}).
      when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl}).
      otherwise({redirectTo: '/home'});
}]);



