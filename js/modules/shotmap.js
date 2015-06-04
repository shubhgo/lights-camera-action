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
