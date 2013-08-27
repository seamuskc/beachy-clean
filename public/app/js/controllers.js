'use strict';

/* Controllers */


function UserListCtrl($scope, Users) {

    $scope.users = Users.query({}, function(){}, function(response){$scope.errorMessage = response.data.message});
    $scope.orderProp = 'lastName';
      
    $scope.deleteUser = function(user){
      
        user.$delete({id:user._id});
        $scope.users.splice($scope.users.indexOf(user),1);
      
  };
}

//UserListCtrl.$inject = ['$scope', 'Users'];



function UserDetailCtrl($scope, $routeParams, Users, $location) {
  
  var user = Users.get({id: $routeParams.userId}, function() {
    $scope.user = user;
  }, function(response){alert(response.data.message)});
  
   $scope.saveUser = function() {
      user.$save({}, function(){$location.path("/users/list")}, function(response){$scope.message = response.data.message;});
      ;
      
  };

}

//UserDetailCtrl.$inject = ['$scope', '$routeParams', 'Users'];

function UserRegistrationCtrl($scope, Users, $location) {
  
  $scope.saveUser = function() {
      //alert(JSON.stringify($scope.user));
      var newUser = new Users($scope.user);
      newUser.$save({}, 
        function(){
            $location.path("/users/list")
        }, 
        function(response){
            $scope.message = response.data.message
        });
      
  };
  
};

//UserRegistrationCtrl.$inject = ['$scope', '$routeParams', 'Users'];
