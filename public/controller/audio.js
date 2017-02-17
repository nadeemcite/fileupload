
myApp.controller('AudioAddController', ['$scope','$http', '$location', function ($scope, $http, $location) {
   
    $scope.submitForm = function () {
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log(file);
        
        // Rest of the key-value pairs should also be send as Form Data elements
        fd.append('name', $scope.name);
       
        $http({
            url:base_url+ 'audio',
            method:'POST',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            console.log(response);
            $location.path('/audio');
        },function (res) {
            console.log(res.data);
        });
    }
    $scope.showAudio=false;
}]);

myApp.controller('AudioController', function ($scope,$http) {
    $http({
        url:base_url +'audios',
        method:'GET'
    }).then(function(res){
        console.log(res)
        $scope.audios=res.data.audios;
    },function(res){
        
    })
});


myApp.controller('AudioEditController',function($scope,$http,$routeParams,$location,$rootScope){
    $scope.square=function(n){
        return n*n;
    }
    $scope.getResult = function(fn, val) {  
         if (fn) {  
          return fn(val);  
        } else {  
          return angular.identity(val);  
        }  
        };
        //console.log($scope.getResult($scope.square,4));
        //console.log($scope.getResult(null,4));
    $http({
        url: base_url +'audio_single/'+$routeParams.id
    }).then(function(res){
        if(res.data.status){
            $scope.name=res.data.audio.name;
            $scope.audioLink='api/audio/song/'+res.data.audio._id+'?i='+$rootScope.rnd();
           
            $scope.showAudio=true;
        } console.log( $scope.audioLink)
    },function(res){
        
    });
    
    $scope.submitForm=function(){
        var file = $scope.myFile;
        
        var fd = new FormData();
        if(file)
        fd.append('file', file);

        // Rest of the key-value pares should also be send as Form Data elements
        fd.append('name', $scope.name);
        $http({
            url: base_url+ 'audio/' + $routeParams.id,
            method:'PUT',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(res.data);
            $location.path('/audio');
        },function (res) {
            console.log(res.data);
        });
    }
});


myApp.controller('AudioDeleteController', ['$scope', '$http', '$location' ,'$routeParams', function ($scope, $http, $location, $routeParams) {
    $http({
        url:base_url + 'audio/' + $routeParams.id
        , method: 'DELETE'
     }).then(function (res) {
        console.log(res);
        $location.path('/audio')
    }, function (response) {
        console.log(res)
    });
}]);