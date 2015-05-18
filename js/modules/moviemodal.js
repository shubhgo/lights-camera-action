var app = angular.module('lcaApp', ['ngLoadingSpinner']);

app.controller('MovieModalCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.movie = {
      Title: 'temp title'
    };
    $scope.updateForMovieID = function(movieid) {

      if (movieid == '') {
        $scope.movie = {
          Title: 'Cound Not Find Movie'
        };
      } else {
        var movieURL = 'http://www.omdbapi.com/?i=' + movieid + '&plot=full&r=json';

        $http.get(movieURL).
        success(function(data, status, headers, config) {
          if (data.Poster != 'N/A') {
            data.Poster = 'data/posters/' + data.imdbID + '.jpg';
          }
          $scope.movie = data;
        }).
        error(function(data, status, headers, config) {
          console.log('error loading data');
        });
      }
    };
  }
]);
//
