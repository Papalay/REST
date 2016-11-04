app.controller('signupCtrl', function($scope, signUpFactory){
    
    $scope.user = {
        username : '',
        email : '',
        password : '',
        confirmation : ''
    };
    
    $scope.formSubmit = function(e){
        if( e == true){          
            signUpFactory.signup( $scope.user);
        }
    }
});

app.controller('loginCtrl', function($scope, signInFactory){
    $scope.user = {
        username : '',
        password : ''
    };
    
    $scope.formSubmit = function(e){
        if( true == e){
            signInFactory.signIn($scope.user);
            
            
        }
        
    }
    
    
    
    
});

app.controller('homeCtrl', function($scope, userFactory, $state, $rootScope){  
    
    if(window.localStorage.getItem('token')){
          $scope.user = userFactory.getUser();
    }
    else {
        $state.go('api');
    }
  $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };


    
});

app.controller('logoutCtrl', function($state, $rootScope){
    
  window.localStorage.removeItem('token');
});


app.controller('adminCtrl', function($scope, $http, $rootScope, userFactory){
    $scope.user = userFactory.getUser();
    
  $scope.formSubmit = function(e){
      if( e == true){
          $http({
              url : BASE_URL + '/api/admin',
              method : 'POST',
              data : {
                  username : $scope.user.username,
                  email : $scope.user.email,
                  password : $scope.user.password
              },
              headers : {
                  'Authorization' : 'Bearer '+ $rootScope.token
              }
          }).then( function( data){
              if( data.data == 'OK' ){
                  $scope.REGISTER_OK =  true
              }
                
          }, function( err){
              console.log( err);
          })   
      }  
  }
     
});

