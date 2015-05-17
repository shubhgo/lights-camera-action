// spot map
var sm = function() {
  var exports = {};

  var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    width = 675 - margin.left - margin.right,
    height = 675 - margin.top - margin.bottom;

  var mapBounds = {
    top: 37.84,
    right: -122.35,
    bottom: 37.68,
    left: -122.55
  };

  var x = d3.scale.linear()
    .range([0, width])
    .domain([mapBounds.left, mapBounds.right]);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain([mapBounds.bottom, mapBounds.top]);

  var color = d3.scale.category10();

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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

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
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on('mousedown', function(d, i) {
            filter('spotSelected', d, i);
          });

        spotSquares
          .transition()
          .duration(duration)
          .ease("quad")
          .style('opacity', 1);

        spotSquares.exit().remove();
      });
    }, duration);
  };

  exports.highlightSpotsForMovie = function(movieID) {

    if (movieID == null) {
      svg.selectAll(".lca-spot")
        .style('stroke', '#FFCD00');
    } else {
      svg.selectAll(".lca-spot")
        .style('stroke', function(data) {
          if (movieID == data.movieid) {
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


var filter = function(action, value, index) {
  if (action == 'timerperiod') {
    sm.reloadMapWithTimePeriod(value);
    mt.reloadMovieWithTimePeriod(value);
  };

  if (action == 'movieTableHover') {
    sm.highlightSpotsForMovie(value.movieid);
  };

  if (action == 'movieTableHoverEnd') {
    sm.highlightSpotsForMovie(null);
  };

  if (action == 'movieTableSelected') {

  };

  if (action == 'spotSelected') {
    //show modal for movie
    angular.element('#movieModal').scope().updateForMovieID(value.movieid)
    $('#movieModal').modal('show');
  };

  if (action == 'search') {};

};

// load the map and the table
filter('timerperiod','1990','');

