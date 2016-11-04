'use strict';
var BASE_URL = 'http://localhost:8888/api/web/app_dev.php';

var app = angular.module('frontApp', ['ui.router', 'ngAnimate','ngMaterial'])
.config( function ($stateProvider, $urlRouterProvider, $mdThemingProvider){
  $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red');
   $stateProvider
    .state('home', {
       url : '/home',
       controller : 'homeCtrl',
       templateUrl : 'views/home.html'
   })
 
    .state('api', {
       url : '/'
   })
   .state('logout', {
       url : '/logout',
       controller : 'logoutCtrl',
       templateUrl : 'index.html'
   })
    .state('admin', {
       parent : 'home',
       url : '/admin',
       controller : 'logoutCtrl',
       templateUrl : 'views/user.html'
   });
    $urlRouterProvider.otherwise('/');
})
.factory('signUpFactory', function($http, $state, $rootScope){
    return {
        signup : function(user){
            if( user.password == user.confirmation){
                 $http({
                     method : 'POST',
                     url : BASE_URL + '/signup',
                     data : {
                         username : user.username,
                         email : user.email,
                         password : user.password
                     }
            }).then( function(data){
                if( 'OK' == data.data){
                    $rootScope.ok = true;
                    $state.go('signin');
                }
                else{
                    console.log( data.data);
                    $rootScope.exist = true;
                }
                 },function( err){
                     $state.go('signup');
                 })    
            }
            else{
                $rootScope.sugnupError = true;
            }
           
        }
    }
})
.factory('signInFactory', function($http, $rootScope, $state, userFactory){
    
    return {
        signIn : function(credentials){
            $http.post(BASE_URL + '/sign-in', credentials)
            .success( function( data, status, headers, config){
        
                if( 'USER_NOT_FOUND' == data){
                    $rootScope.userNotFound = true; 
                }
                else {
                    var token = data.token;
                    $rootScope.token = token;  
                    window.localStorage.setItem('token', token);
                    $http({
                        method : 'POST',
                        url : BASE_URL + '/api/home',
                        data : {
                            username : credentials.username
                        },
                        headers : {
                            'Authorization' : 'Bearer '+ window.localStorage.getItem('token')
                        }         
                    }).then( function(data){             
                        userFactory.setUser( data.data); 
                        $state.go('home');          
                    }, function( data){
                        if( 'USER_NOT_FOUND' == data.data){
                            $rootScope.userNotFound = true;
                        }
                    })
                }
            })
            .error( function ( data, status, headers, config){
                console.log( data);
            })
        }
    }
})
.factory( 'userFactory', function(){
    var user = null;
    return {
        setUser : function(u){
            user = u;
        },
        getUser : function(){
            return user;
        } 
    }
})
;
    