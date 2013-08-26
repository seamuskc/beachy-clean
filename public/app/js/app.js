'use strict';

/* App Module */

angular.module('beachyCleanApp', ['beachyCleanAppFilters', 'beachyCleanAppServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/users/list', {templateUrl: 'partials/user-list.html',   controller: UserListCtrl}).
      when('/user/:userId', {templateUrl: 'partials/user-detail.html', controller: UserDetailCtrl}).
      when('/register', {templateUrl: 'partials/register.html', controller: UserRegistrationCtrl}).
      otherwise({redirectTo: '/register'});
}]);
