'use strict';

/* Controllers */


function HeaderCtrl($scope, $location, $http) {
    
    $scope.isAuthenticated = false;
    $scope.displayLogin = false;
    
    $scope.showLogin = function() {
        $scope.email = "";
        $scope.password = "";
        $scope.displayLogin = true;
        $scope.msg = undefined;
    };
    
    $scope.login = function() {
        
        $scope.msg = undefined;
        
        $http.post('/login', {username:$scope.email, password:$scope.password})
        .success(function(resp){
            $scope.user = resp;
            $scope.isAuthenticated = true;
            $scope.displayLogin = false;
            $location.path("/users/list");
        })
        .error(function(resp){
            $scope.msg = "Nope! Try again!";
        })
        
    };
    
    $scope.logout = function() {
        $scope.isAuthenticated = false;
        $location.path("/home");
        
    };
}

function UserListCtrl($scope, Users) {

    $scope.users = Users.query({}, function(){}, function(response){$scope.errorMessage = response.data.message});
    $scope.orderProp = 'lastName';
    
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
    
    $scope.deleteUser = function(user){
      
        user.$delete({id:user._id}, 
            // Success
            function(val, respHeaders){
                $scope.users.splice($scope.users.indexOf(user), 1)
                $scope.alerts[0] = {type:"success", msg:"User removed."};
            }, 
            // Failure
            function(response){
                $scope.alerts[0] = {type:"error", msg:"Unable to remove user at this time."};
            }
        );
      
  };
}

//UserListCtrl.$inject = ['$scope', 'Users'];



function UserDetailCtrl($scope, $routeParams, Users, $location) {

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    var user = Users.get({id: $routeParams.userId},
        function() {
            // Success callback
            $scope.user = user;
        },
        function(response) {
            // Failure callback
            $scope.alerts.push({type: "error", msg: response.data.message});
        }
    );

    $scope.saveUser = function() {
        user.$save({},
            function() {
                // success
                $location.path("/users/list");
            },
            function(response) {
                // failure
                $scope.alerts.push({type: "error", msg: response.data.message});
            }
        );


    };

}

//UserDetailCtrl.$inject = ['$scope', '$routeParams', 'Users'];

function UserRegistrationCtrl($scope, Users, $location, $http) {
  
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
  
  $scope.checkEmail = function() {
      
      $http.get("/login/available?email=" + $scope.email).success(function(resp){
          if (!resp.isLoginAvail) {
              $scope.message = "This email has already been taken";
          }
      });
      
      
  }
  
};

function HomeCtrl($scope) {
    
    
};

//UserRegistrationCtrl.$inject = ['$scope', '$routeParams', 'Users'];
