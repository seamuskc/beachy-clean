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
    }])


    .run(['$rootScope', '$location', function ($rootScope, $location) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ("partials/home.html" == next.$$route.templateUrl) {
                return;
            }
            if (!$rootScope.user) {
                // User isn't logged in, send to home page
                $location.path('/home');
            }
            
        });

    }]);
