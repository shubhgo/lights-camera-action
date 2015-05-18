// spot map
var sm = function() {
  var exports = {};

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

  var color = d3.scale.linear()
    .domain([0, 10])
    .range(["white", "#FFCD00"]);

  var opacity = d3.scale.linear()
    .domain([0, 10])
    .range([0.3, 1.0]);

  var tip = d3.tip()
    .attr('class', 'lca-spot-tip-tap')
    .offset([19, 4])
    .html(function(d) {
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

  // Rating Legend
  // todo remove positioning hardcoding
  // d3.select(".lca-spot-map-box").append("rect")
  //   .attr("class", "lca-legend")
  //   .attr("x", width - 100)
  //   .attr("y", height - 160)
  //   .attr("width", 100)
  //   .attr("height", 120)
  //   .style("fill", "red");

  // d3.select(".lca-spot-map-box").append("text")
  //   .attr("class", "lca-legend-text")
  //   .attr("x", width - 90)
  //   .attr("y", height - 140)
  //   .text("IMDB Rating");

  // d3.select(".lca-spot-map-box").append("rect")
  //   .attr("class", "lca-legend-rect")
  //   .attr()

  // Filter legend
  d3.select(".lca-spot-map-box").append("rect")
    .attr("class", "lca-filter")
    .attr("x", 0)
    .attr("y", height - selectionHeight)
    .attr("width", width)
    .attr("height", selectionHeight)

  exports.filterText = d3.select(".lca-spot-map-box")
    .append("text")
    .attr("class", "lca-filter-text")
    .attr("x", 10)
    .attr("y", height - 14)
    .text("Selection Text");

  exports.reloadMapWithTimePeriod = function(timePeriod) {
    var duration = 200;
    var timePeriodFile = 'data/map/map_' + timePeriod + '.json';
    svg.selectAll(".lca-spot")
      .transition()
      .duration(duration)
      .ease("quad")
      .style('opacity', 0);

    setTimeout(function() {
      d3.json(timePeriodFile, function(error, data) {
        var spotSquares = svg.selectAll(".lca-spot")
          .data(data);

        spotSquares.enter().append("rect")
          .attr("class", "lca-spot");

        spotSquares
          .attr("x", function(d) {
            if (d.long) {
              return x(d.long);
            } else {
              return 0
            }
          })
          .attr("y", function(d) {
            if (d.lat) {
              return y(d.lat);
            } else {
              return 0
            }
            // return y(d.Latitude); 
          })
          .attr('width', 10)
          .attr('height', 10)
          .style('stroke', function(d, i) {
            return color(d.rating);
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on('mousedown', function(d, i) {
            filter('spotSelected', d, i);
          });

        spotSquares
          .transition()
          .duration(duration)
          .ease("quad")
          .style('opacity', function(d) {
            return opacity(d.rating);
          });

        spotSquares.exit().remove();
      });
    }, duration);
  };

  exports.highlightSpotsForMovie = function(movieTitle) {

    if (movieTitle == null) {
      svg.selectAll(".lca-spot")
        .style('stroke', function(d, i) {
            return color(d.rating);
          });
    } else {
      svg.selectAll(".lca-spot")
        .style('stroke', function(data) {
          if (movieTitle == data.title) {
            return '#FFCD00';
          } else {
            return '#646464';
          }
        });
    };

    // .style("stroke", function(data) {
    //     if (data.destination == dest) {
    //         return "#619EB5";
    //     } else {
    //         return "#C8C8C8";
    //     }
    // })
    // .style("stroke-width", function(data) {
    //     if (data.destination == dest) {
    //         return 2;
    //     } else {
    //         return 0.5;
    //     }
    // })
    // .style("stroke-opacity", function(data) {
    //     if (data.destination == dest) {
    //         return 1;
    //     } else {
    //         return 0.8;
    //     }
    // });

  };

  return exports;
}();

// time period
var tp = function() {
  var exports = {};

  exports.selectTimePeriod = function(timePeriod) {
    $('.lca-col-timeperiod').removeClass("lca-col-timeperiod-sel");
    $('#div' + String(timePeriod)).addClass("lca-col-timeperiod-sel");
  };

  return exports;
}();

var currentFilter = {
  'timeP': '1990',
  'movie': 'title',
  'spot': null
};

var filter = function(action, value, index) {
  if (action == 'timerperiod') {
    var tprd = String(value);
    currentFilter.timeP = tprd;
    currentFilter.movie = null;
    // currentFilter.spot = null;

    var totp = tprd.substr(0, 3) + '9';
    var filterText = 'Time Period: ' + tprd + ' to ' + totp;
    sm.filterText.text(filterText);

    sm.reloadMapWithTimePeriod(value);
    mt.reloadMovieWithTimePeriod(value);

    tp.selectTimePeriod(value);
  };

  if (action == 'movieTableHover') {
    var tprd = currentFilter.timeP;
    var totp = tprd.substr(0, 3) + '9';
    currentFilter.movie = value.title;
    var filterText = 'Time Period: ' + tprd + ' to ' + totp + ' Movie: ' + value.title;
    sm.filterText.text(filterText);

    sm.highlightSpotsForMovie(value.title);
    mt.highlightMovie(value.title);
  };

  if (action == 'movieTableHoverEnd') {
    var tprd = currentFilter.timeP;
    var totp = tprd.substr(0, 3) + '9';
    currentFilter.movie = null;
    var filterText = 'Time Period: ' + tprd + ' to ' + totp;
    sm.filterText.text(filterText);

    sm.highlightSpotsForMovie(null);
    mt.highlightMovie(null);
  };

  if (action == 'movieTableSelected') {

  };

  if (action == 'spotSelected') {
    //show modal for movie
    angular.element('#movieModal').scope().updateForMovieID(value.movieid);
    angular.element($('#movieModal')).scope().$apply();
    $('#movieModal').modal('show');
  };

  if (action == 'search') {};

};

// load the map and the table
filter('timerperiod', '1990', '');
