angular.module('lcaApp', [])
  .controller('MovieModalCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.movie = {
        Title: 'temp title'
      };
      $scope.updateForMovieID = function(movieid) {
        var movieURL = 'http://www.omdbapi.com/?i=' + movieid + '&plot=full&r=json';

        $http.get(movieURL).
        success(function(data, status, headers, config) {
          $scope.movie = data;
        }).
        error(function(data, status, headers, config) {
          console.log('error loading data');
        });
      };
    }
  ]);
