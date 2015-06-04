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