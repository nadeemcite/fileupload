myApp.controller('FormController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.setDate = function () {
        var ondateObj = new Date(moment(moment($scope.event.ondate).format("DD-MM-YYYY") + " " + moment($scope.event.ondateTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        $scope.event.notificationDate = new Date(moment(ondateObj).subtract(6, 'hours'));
        $scope.event.notificationTime = new Date(moment(ondateObj).subtract(6, 'hours'));
    }
    $scope.formSubmit = function () {
        var notificateObj = new Date(moment(moment($scope.event.notificationDate).format("DD-MM-YYYY") + " " + moment($scope.event.notificationTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        var ondateObj = new Date(moment(moment($scope.event.ondate).format("DD-MM-YYYY") + " " + moment($scope.event.ondateTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        var reqObj = {
            event: {
                name: $scope.event.name
                , description: $scope.event.description
                , location: $scope.event.location
                , notification: notificateObj
                , ondate: ondateObj
            }
        }
        console.log(reqObj);

        $http({
            url: base_url + 'event'
            , method: 'POST'
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: JSON.stringify(reqObj)
        }).then(function (response){

            console.log(response);
            $location.path('/allevents')
        }, function (response) {
            console.log(response.data);
        });
    }
    $scope.notificationNow = function (event) {
        var reqObj = {
            "app_id": "aa7aa16f-ff93-4dda-8145-9a4826141d13"
            , "included_segments": ["Active Users"]
            , "data": {
                "page": "bar"
            }
            , "headings": {
                "en": "New Event"
            }
            , "contents": {
                "en": event.name + " is scheduled on " + moment(event.ondate).format("DD/MM/YYYY")
            }
        }
        $http({
            url: 'https://onesignal.com/api/v1/notifications'
            , method: 'POST'
            , headers: {
                'Content-Type': 'application/json'
                , 'Authorization': 'Basic YTUxMmViNGEtYzRmNy00NGRhLWFkYjAtNDQwMjUzYjQ2NTY4'
            }
            , data: JSON.stringify(reqObj)
        }).then(function (response) {
            alert('Successfully sent')
        }, function (response) {
            console.log(response.data);
        });
    }
}]);
myApp.controller('EventAllController', ['$scope', '$http', '$mdToast', function ($scope, $http, $mdToast) {
    //showWait();
    $http({
        url: base_url + 'events'
        , method: 'GET'
    }).then(function (response) {
        //hideWait();
        console.log(response);
        var events = response.data.result;
        console.log(events);
        events.sort(function (ob1, ob2) {
            if (ob1.ondate > ob2.ondate) return -1;
            else if (ob1.ondate < ob2.ondate) return 1;
            return 0;
        });
        $scope.events = events;
    }, function (response) {
        alert('Something went wrong')
    });
    $scope.notification = function (event) {
        var reqObj = {
            "app_id": "aa7aa16f-ff93-4dda-8145-9a4826141d13"
            , "included_segments": ["Active Users"]
            , "data": {
                "page": "bar"
            }
            , "headings": {
                "en": "New Event"
            }
            , "contents": {
                "en": event.name + " is scheduled on " + moment(event.ondate).format("DD/MM/YYYY")
            }
        }
        $http({
            url: 'https://onesignal.com/api/v1/notifications'
            , method: 'POST'
            , headers: {
                'Content-Type': 'application/json'
                , 'Authorization': 'Basic YTUxMmViNGEtYzRmNy00NGRhLWFkYjAtNDQwMjUzYjQ2NTY4'
            }
            , data: JSON.stringify(reqObj)
        }).then(function (response) {
            alert('Successfully sent')
        }, function (response) {
            console.log(response.data);
        });
    }
}]);
myApp.controller('EventDeleteController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    $http({
        url: base_url + 'event/' + $routeParams.id
        , method: 'DELETE'
    , }).then(function (response) {
        console.log(response.data)
        $location.path('/allevents')
    }, function (response) {
        console.log(response.data)
    });
}]);
myApp.controller('EventEditController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
    $scope.setDate = function () {
        var ondateObj = new Date(moment(moment($scope.event.ondate).format("DD-MM-YYYY") + " " + moment($scope.event.ondateTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        $scope.event.notificationDate = new Date(moment(ondateObj).subtract(6, 'hours'));
        $scope.event.notificationTime = new Date(moment(ondateObj).subtract(6, 'hours'));
    }
    $http({
        url: base_url + 'event/' + $routeParams.id
        , method: 'GET'
    }).then(function (response) {
        //console.log(moment(response.data.result.notification).format("MM-DD-YYYY"));
        //console.log(moment(response.data.result.ondate).format("MM-DD-YYYY"));
        //console.log(moment(response.data.result.ondate))
        //$scope.ondate =moment(response.data.result.ondate).format("MM-DD-YYYY")
        //$scope.notificationTime = moment(response.data.result.notification)
        //$scope.notificationDate = moment(response.data.result.notification)
        //console.log($scope.ondate);
        $scope.event = {
            name: response.data.result.name
            , description: response.data.result.description
            , location: response.data.result.location
            , ondate:moment(response.data.result.ondate).toDate()
            , ondateTime: moment(response.data.result.ondate)
            , notificationDate:moment(response.data.result.notification).toDate()
            , notificationTime: moment(response.data.result.notification)
        };
        //console.log($scope.event.ondate);
    }, function (response) {
        console.log(response.data);
    });
    $scope.formSubmit = function () {
        console.log($scope.event);
        delete $scope.event.id;
        var notificateObj = new Date(moment(moment($scope.event.notificationDate).format("DD-MM-YYYY") + " " + moment($scope.event.notificationTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        var ondateObj = new Date(moment(moment($scope.event.ondate).format("DD-MM-YYYY") + " " + moment($scope.event.ondateTime).format("HH:mm"), "DD-MM-YYYY HH:mm"));
        var reqObj = {
            event: {
                  name: $scope.event.name
                , description: $scope.event.description
                , location: $scope.event.location
                , notification: notificateObj
                , ondate: ondateObj
            }
        }
        console.log(reqObj);
        $http({
            url: base_url + 'event/' + $routeParams.id
            , method: 'PUT'
            , headers: {
                'Content-Type': 'application/json'
            }
            , data: JSON.stringify(reqObj)
        }).then(function (response){

            console.log(response);
            $location.path('/allevents')
        }, function (response) {
            console.log(response.data);
        });
    }
}]);
