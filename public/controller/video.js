
myApp.controller('VideoAddController', ['$scope','$http', '$location', function ($scope, $http, $location) {
   
    $scope.submitForm = function () {
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log(file);
        
        // Rest of the key-value pairs should also be send as Form Data elements
        fd.append('name', $scope.name);
       
        $http({
            url:base_url+ 'video',
            method:'POST',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(res);
            $location.path('/video');
        },function (res) {
            console.log(res.data);
        });
    }
    $scope.showVideo=false;
}]);

myApp.controller('VideoController', function ($scope,$http) {
    $http({
        url:base_url +'videos',
        method:'GET'
    }).then(function(res){
        console.log(res)
        $scope.videos=res.data.videos;
    },function(res){
        
    })
});


myApp.controller('VideoEditController',function($scope,$http,$routeParams,$location,$rootScope){
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
        url: base_url +'video_single/'+$routeParams.id
    }).then(function(res){
        if(res.data.status){
            $scope.name=res.data.video.name;
            $scope.videoLink='api/video/song/'+res.data.video._id+'?i='+$rootScope.rnd();
           
            $scope.showVideo=true;
        } console.log( $scope.videoLink)
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
            url: base_url+ 'video/' + $routeParams.id,
            method:'PUT',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(res.data);
            $location.path('/video');
        },function (res) {
            console.log(res.data);
        });
    }
});


myApp.controller('VideoDeleteController', ['$scope', '$http', '$location' ,'$routeParams', function ($scope, $http, $location, $routeParams) {
    $http({
        url:base_url + 'video/' + $routeParams.id
        , method: 'DELETE'
     }).then(function (res) {
        console.log(res);
        $location.path('/video')
    }, function (response) {
        console.log(res)
    });
}]);