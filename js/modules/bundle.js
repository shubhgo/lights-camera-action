(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var margin = {
    top: 20,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = 288 - margin.left - margin.right,
  rowWidth = 25,
  height = 675 - margin.top - margin.bottom;

var x = d3.scale.linear()
  .range([0, width])
  .domain([0, 10]);

var y = d3.scale.linear();

// var xAxis = d3.
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("top")
  .ticks(3);

var svg = d3.select(".lca-movie-table").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxisObject = svg.append("g")
  .attr("class", "lca-x-axis")
  .attr("transform", "translate(0, -1)")
  .call(xAxis);

xAxisObject
  .selectAll("text")
  .attr("dx", "-.6em")
  .attr("dy", ".40em");

xAxisObject
  .append("text")
  .attr("class", "label")
  .attr("x", 3)
  .attr("y", -5)
  .style("text-anchor", "start")
  .text("Number of Scenes");

var filter = function() {};

module.exports.setFilterCallback = function (callback) {
  filter = callback;
};

module.exports.reloadMovieWithTimePeriod = function (timePeriod) {
  var duration = 200;
  var timePeriodFile = 'data/movies/movies_' + timePeriod + '.json';

  svg.selectAll(".lca-movie, .lca-movie-label")
    .transition()
    .duration(duration)
    .ease("quad")
    .style('opacity', 0);

  setTimeout(function () {
    d3.json(timePeriodFile, function (error, data) {

      // change table height lca-movie-table
      var tableHeight = rowWidth * data.length + 20;
      $(".lca-movie-table").css("height", tableHeight);



      y.range([0, rowWidth * data.length])
        .domain([0, data.length]);

      var movieRowBackground = svg.selectAll(".lca-movie-bck")
        .data(data);

      movieRowBackground.enter().append("rect")
        .attr("class", "lca-movie-bck");

      movieRowBackground
        .attr("x", 0)
        .attr("y", function (data, index) {
          return y(index);
        })
        .attr('width', width)
        .attr('height', rowWidth - 1)
        .style('fill', 'grey')
        .on('mouseover.hideotherspots', function (d, i) {
          filter('movieTableHover', d, i);
        })
        .on('mouseout.showallspots', function (d, i) {
          filter('movieTableHoverEnd', '', '');
        })
        .on('click', function (d, i) {
          filter('movieTableSelected', d, i);
        });


      var movieRow = svg.selectAll(".lca-movie")
        .data(data);

      movieRow.enter().append("rect")
        .attr("class", "lca-movie");

      movieRow
        .attr("x", 0)
        .attr("y", function (data, index) {
          return y(index);
        })
        .attr('width', function (data) {
          if (x(data.shotCount) > width) {
            return width;
          } else {
            return x(data.shotCount);
          }
        })
        .attr('height', rowWidth - 1)
        .style('fill', '#FFCD00');

      var movieLabel = svg.selectAll('.lca-movie-label')
        .data(data);

      movieLabel.enter().append('text')
        .attr('class', 'lca-movie-label');

      movieLabel
        .attr('x', 3)
        .attr('y', function (data, index) {
          return y(index) + 16;
        })
        .attr('dy', '.16em')
        .text(function (data) {
          return data.title;
        });


      svg.selectAll(".lca-movie, .lca-movie-label")
        .transition()
        .duration(duration)
        .ease("quad")
        .style('opacity', 1);

      movieLabel.exit().remove();
      movieRow.exit().remove();
      movieRowBackground.exit().remove();
    });
  }, duration);
};

module.exports.highlightMovie = function (movieTitle) {

  if (!movieTitle) {
    svg.selectAll(".lca-movie")
      .style('stroke', null)
      .style('fill', '#FFCD00');

    svg.selectAll(".lca-movie-bck")
      .style('stroke', null);
  } else {
    svg.selectAll(".lca-movie")
      .style('fill', function (data) {
        if (movieTitle == data.title) {
          return '#FFCD00';
        } else {
          return '#6d6d6d';
        }
      });

    svg.selectAll(".lca-movie-bck")
      .style('stroke', function (data) {
        if (movieTitle == data.title) {
          return '#000000';
        } else {
          return null;
        }
      });

  } //end if

};
},{}],2:[function(require,module,exports){
// spot map

var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = 590 - margin.left - margin.right,
  height = 590 - margin.top - margin.bottom;

var mapBounds = {
  top: 37.84,
  right: -122.35,
  bottom: 37.68,
  left: -122.55
};

var selectionHeight = 40;

var x = d3.scale.linear()
  .range([0, width])
  .domain([mapBounds.left, mapBounds.right]);

var y = d3.scale.linear()
  .range([height, 0])
  .domain([mapBounds.bottom, mapBounds.top]);

var tip = d3.tip()
  .attr('class', 'lca-spot-tip-tap')
  .offset([19, 4])
  .html(function (d) {
    return "<div class='lca-spot-tip-head'></div> <div class='lca-spot-tip'><span>" + d.title +
      "</span></div>";
  })
  .direction('e');

var svg = d3.select(".lca-spot-map").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("class", "lca-spot-map-box")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// Filter legend
d3.select(".lca-spot-map-box").append("rect")
  .attr("class", "lca-filter")
  .attr("x", 0)
  .attr("y", height - selectionHeight)
  .attr("width", width)
  .attr("height", selectionHeight);

var filter = function() {};

module.exports.setFilterCallback = function (callback) {
  filter = callback;
};

module.exports.filterText = d3.select(".lca-spot-map-box")
  .append("text")
  .attr("class", "lca-filter-text")
  .attr("x", 10)
  .attr("y", height - 14)
  .text("Selection Text");

module.exports.reloadMapWithTimePeriod = function (timePeriod) {
  var duration = 200;
  var timePeriodFile = 'data/map/map_' + timePeriod + '.json';
  svg.selectAll(".lca-spot")
    .transition()
    .duration(duration)
    .ease("quad")
    .style('opacity', 0);

  setTimeout(function () {
    d3.json(timePeriodFile, function (error, data) {
      var spotSquares = svg.selectAll(".lca-spot")
        .data(data);

      spotSquares.enter().append("rect")
        .attr("class", "lca-spot");

      spotSquares
        .attr("x", function (d) {
          if (d.long) {
            return x(d.long);
          } else {
            return 0;
          }
        })
        .attr("y", function (d) {
          if (d.lat) {
            return y(d.lat);
          } else {
            return 0;
          }
          // return y(d.Latitude); 
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('stroke', '#FFCD00')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('mousedown', function (d, i) {
          filter('spotSelected', d, i);
        });

      spotSquares
        .transition()
        .duration(duration)
        .ease("quad")
        .style('opacity', 0.6);

      spotSquares.exit().remove();
    });
  }, duration);
};

module.exports.highlightSpotsForMovie = function (movieTitle) {

  if (!movieTitle) {
    svg.selectAll(".lca-spot")
      .style('stroke', '#FFCD00')
      .style('opacity', 0.6);
  } else {
    svg.selectAll(".lca-spot")
      .style('stroke', function (data) {
        if (movieTitle == data.title) {
          return '#FFCD00';
        } else {
          return '#646464';
        }
      })
      .style('opacity', function (data) {
        if (movieTitle == data.title) {
          return 1.0;
        } else {
          return 0.6;
        }
      });
  }
};

},{}],3:[function(require,module,exports){
// time period

var filter = function() {};

module.exports.setFilterCallback = function (callback) {
  filter = callback;
};

module.exports.init = function () {
  $('.lca-col-timeperiod').click(function (event) {
  	var divId = event.target.id;
  	filter('timerperiod',parseInt(divId.slice(3)),0);
  });
}

module.exports.selectTimePeriod = function (timePeriod) {
  $('.lca-col-timeperiod').removeClass("lca-col-timeperiod-sel");
  $('#div' + String(timePeriod)).addClass("lca-col-timeperiod-sel");
};


},{}],4:[function(require,module,exports){
!(function () {
  var sm = require('./shotmap.js');
  var mt = require('./movieTable.js');
  var tp = require('./timePeriod.js');

  // var sm = ShotMap();
  // // sm.setFilterCallback(filter);
  // var mt = MovieTable();
  // // mt.setFilteCallback(filter);
  // var tp = TimePeriod();

  sm.setFilterCallback(filter);
  mt.setFilterCallback(filter);
  tp.setFilterCallback(filter);
  tp.init();

  var currentFilter = {
    'timeP': '1990',
    'movieHover': '',
    'movieSelected': null,
    'spot': null
  };

  function filter(action, value, index) {
    var tprd, totp, filterText;
    if (action == 'timerperiod') {
      tprd = String(value);
      currentFilter.timeP = tprd;
      currentFilter.movieHover = null;
      currentFilter.movieSelected = null;
      // currentFilter.spot = null;

      totp = tprd.substr(0, 3) + '9';
      filterText = 'Time Period: ' + tprd + ' to ' + totp;
      sm.filterText.text(filterText);

      sm.reloadMapWithTimePeriod(value);
      mt.reloadMovieWithTimePeriod(value);

      tp.selectTimePeriod(value);
    }

    if (action == 'movieTableHover') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieHover = value.title;
      currentFilter.movieSelected = null;
      filterText = 'Time Period: ' + tprd + ' to ' + totp + ' Movie: ' + value.title;
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(value.title);
      mt.highlightMovie(value.title);
    }

    if (action == 'movieTableHoverEnd') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieHover = null;

      filterText = 'Time Period: ' + tprd + ' to ' + totp;
      if (currentFilter.movieSelected) {
        filterText = filterText + ' Movie: ' + currentFilter.movieSelected;
      }
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(currentFilter.movieSelected);
      mt.highlightMovie(currentFilter.movieSelected);
    }

    if (action == 'movieTableSelected') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieSelected = value.title;
      filterText = 'Time Period: ' + tprd + ' to ' + totp + ' Movie: ' + value.title;
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(value.title);
      mt.highlightMovie(value.title);
    }

    if (action == 'spotSelected') {
      //show modal for movie
      angular.element('#movieModal').scope().updateForMovieID(value.movieid);
      angular.element($('#movieModal')).scope().$apply();
      $('#movieModal').modal('show');
    }

    if (action == 'search') {}

  };

  // load the map and the table
  filter('timerperiod', '2000', '');
})()

},{"./movieTable.js":1,"./shotmap.js":2,"./timePeriod.js":3}]},{},[4]);
