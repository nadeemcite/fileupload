myApp.controller('GalleryMasterController', function ($scope,$http) {
    $http({
        url:'api/gallery',
        method:'GET'
    }).then(function(res){
        console.log(res)
        $scope.galleries=res.data.galleries;
    },function(res){
        
    })
});
myApp.controller('GalleryFormController', function ($scope,$http, $location) {
    $scope.submitForm = function () {
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log(file);
        
        // Rest of the key-value pairs should also be send as Form Data elements
        fd.append('name', $scope.name);
       
        $http({
            url: 'api/gallery',
            method:'POST',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(res.data);
            $location.path('/');
        },function (res) {
            console.log(res.data);
        });
    }
    $scope.showImage=false;
});

myApp.controller('GalleryEditController',function($scope,$http,$routeParams,$location,$rootScope){
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
        console.log($scope.getResult($scope.square,4));
        console.log($scope.getResult(null,4));
    $http({
        url:'api/gallery_single/'+$routeParams.id
    }).then(function(res){
        if(res.data.status){
            $scope.name=res.data.gallery.name;
            $scope.imageLink='api/gallery/image/'+res.data.gallery._id+'?i='+$rootScope.rnd();
           
            $scope.showImage=true;
        } console.log( $scope.imageLink)
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
            url: 'api/gallery/'+$routeParams.id,
            method:'PUT',
            data: fd,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(res.data);
            $location.path('/');
        },function (res) {
            console.log(res.data);
        });
    }
});

myApp.controller('GalleryDeleteController', ['$scope', '$http', '$location' ,'$routeParams', function ($scope, $http, $location, $routeParams) {
    $http({
        url: 'api/gallery/' + $routeParams.id
        , method: 'DELETE'
     }).then(function (res) {
        console.log(res);
        $location.path('/')
    }, function (response) {
        console.log(response.data)
    });
}]);