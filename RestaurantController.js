// Code goes here

(function() {

  var app = angular.module("restaurantViewer");

  var RestaurantController = function($scope, $http, $routeParams) {

    var onRestarauntComplete = function(response) {
      $scope.restaurants = response.data;
      $scope.searchComplete = true;
      $scope.initializeMapPointers();
    };
    
    var onError = function(reason) {
      $scope.error = "Could not fetch the data.";
    };


    $scope.search = function(distance, latitude, longitude){
      url = "https://agile-sierra-8502.herokuapp.com/restaurants/.json?"
      if (distance != null) {
        url += "distance=" + distance + "&"
      }
      if (latitude != null) {
        url += "latitude=" + latitude + "&"
      }
      if (longitude != null) {
        url += "longitude=" + longitude + "&"
      }
      $http.get(url)
        .then(onRestarauntComplete, onError);
    };

    $scope.initializeMap = function() {
      var mapOptions = {
        center: new google.maps.LatLng($scope.latitude, $scope.longitude),
        zoom: 13
      };
      $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      $scope.mapInitialized = true;
      $scope.initializeMapPointers();
    };

    $scope.initializeMapPointers = function() {
      // Make sure that this only happens after both the search has completed and the
      // map has initialized (we don't know for sure what order they'll happen in)
      if (!$scope.mapInitialized || !$scope.searchComplete) {
        return;
      }

      angular.forEach($scope.restaurants, function(restaurant, key) {
        var marker = new google.maps.Marker( {
          position: new google.maps.LatLng(restaurant.latitude, restaurant.longitude),
          map: $scope.map,
          title: restaurant.name
        });
      });
    };

    $scope.distance = $routeParams.distance;
    $scope.latitude = $routeParams.latitude;
    $scope.longitude = $routeParams.longitude;
    $scope.search($scope.distance, $scope.latitude, $scope.longitude);

 //   $scope.repoSortOrder = "-stargazers_count";


  };
  
  app.controller("RestaurantController", ["$scope", "$http", "$routeParams", RestaurantController]);

}());