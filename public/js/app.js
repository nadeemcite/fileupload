var myApp = angular.module('myApp', ["ngRoute",'ngMaterial','ngMaterialDatePicker']);
var base_url = '/'

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/form', {
        templateUrl: 'views/form.html'
        , controller: 'FormController'
    }).when('/allevents', {
        templateUrl: 'views/events.html'
        , controller: 'EventAllController'
    }).when('/Form2', {
        templateUrl: 'views/form.html'
        , controller: 'NewEventController'
    }).when('/editevent/:id', {
        templateUrl: 'views/form.html'
        , controller: 'EventEditController'
    }).when('/event/:id', {
        template: ''
        , controller: 'EventDeleteController'
    }).when('/', {
        templateUrl: 'views/master.html',
        controller: 'GalleryMasterController'
    }).when('/gallery/addnew',{        
        templateUrl: 'views/gallery_form.html',
        controller: 'GalleryFormController'
    }).when('/galleryedit/:id',{        
        templateUrl: 'views/gallery_form.html',
        controller: 'GalleryEditController'
    }).when('/gallery/delete/:id', {
        template: ''
        , controller: 'GalleryDeleteController'
    }).when('/csv', {
        templateUrl: 'views/csv.html'
        , controller: 'CSVController'
    }).when('/audio/add',{
       templateUrl:'views/audio_form.html'
       ,controller:'AudioAddController'
    }).when('/audio',{
       templateUrl:'views/audio_master.html'
       ,controller:'AudioController'
    }).when('/audio/edit/:id',{
       templateUrl:'views/audio_form.html'
       ,controller:'AudioEditController'
    }).when('/audio/delete/:id',{
       template:''
       ,controller:'AudioDeleteController'
    }).when('/video/add',{
       templateUrl:'views/video_form.html'
       ,controller:'VideoAddController'
    }).when('/video',{
       templateUrl:'views/video_master.html'
       ,controller:'VideoController'
    }).when('/video/edit/:id',{
       templateUrl:'views/video_form.html'
       ,controller:'VideoEditController'
    }).when('/video/delete/:id',{
       template:''
       ,controller:'VideoDeleteController'
    }).otherwise({
        redirectTo: "/"
    });
}]);

/*function showWait() {
    $('.mymodal').addClass('active');
}
function hideWait() {
    $('.mymodal').removeClass('active');
}*/


myApp.run(function($rootScope){
    $rootScope.rnd=function(){
        return Math.floor(Math.random() * 1000) + 1;
        
    }
});


myApp.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

myApp.controller('CSVController',function($http,$scope){
  
    $scope.readCSV = function() {
        
        console.log($scope.csv);
        var read = new FileReader();
	    read.readAsBinaryString($scope.csv);

        read.onloadend = function(){
            var doc=(read.result);
            var lines=doc.split("\n");
            var json=lines.map(function(item){
               return csvParse(item); 
            });
            console.log(json)
            var j=0;
            var objArray=[];
            for(var i=1;i<json.length;i++)
            {
                if(json[i][0]!=null || json[i][0]!='\n'|| json[i][0]!='\0'){
                var obj={};
                for (var k=0; k<json[0].length; k++)
                {
                    obj[json[0][k]] =json[i][k];
                    
                }
                objArray.push(obj)
                }
            }
            console.log(objArray)
        }
	}
    
       }) 

	


myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

function dumbComaSplit(inputString) {
   var strArray = [];
   var tmpStr = "";
   for (var i = 0; i < inputString.length; i++) {
        if (inputString.charAt(i) == ',') {
            strArray.push(tmpStr);
            tmpStr = "";
            continue;
        }
        tmpStr += inputString.charAt(i);
    }
    strArray.push(tmpStr);
    return strArray;
};

function csvParse(inputString) {
   var outputArray = [];
   var inputArray = dumbComaSplit(inputString);
   for (var i =0; i < inputArray.length; i++) {
     if (!Number.isNaN(+inputArray[i])) {
       outputArray.push(+inputArray[i]);
   } else {
     outputArray.push(inputArray[i].replace(/['"]+/g,'').trim());
   }
   }
   return outputArray;
};
