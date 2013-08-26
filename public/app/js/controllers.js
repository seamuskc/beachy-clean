'use strict';

/* Controllers */


function UserListCtrl($scope, User) {

    $scope.users = User.query();
    $scope.orderProp = 'lastName';
  
    $scope.deleteUser = function(user){
      
        user.$delete({id:user._id});
        $scope.users.splice($scope.users.indexOf(user),1);
      
  };
}

//UserListCtrl.$inject = ['$scope', 'User'];



function UserDetailCtrl($scope, $routeParams, User, $location) {
  
  var user = User.get({id: $routeParams.userId}, function() {
    $scope.user = user;
  });
  
   $scope.saveUser = function() {
      user.$save();
      $location.path("/users/list");
      
  };

}

//UserDetailCtrl.$inject = ['$scope', '$routeParams', 'User'];

function UserRegistrationCtrl($scope, User, $location) {
  
  $scope.saveUser = function() {
      //alert(JSON.stringify($scope.user));
      var newUser = new User($scope.user);
      newUser.$save();
      $location.path("/users/list");
      
  };
  
};

