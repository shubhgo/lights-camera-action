var mt = function() {
  var exports = {};
  var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    width = 180 - margin.left - margin.right,
    rowWidth = 25,
    height = 675 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0, width])
    .domain([0, 10]);

  var y = d3.scale.linear();

  var svg = d3.select(".lca-movie-table").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("data/movies/movies_1990.json", function(error, data) {
    y.range([0, rowWidth * data.length])
      .domain([0, data.length]);

    svg.selectAll(".lca-movie")
      .data(data)
      .enter().append("rect")
      .attr("class", "lca-movie")
      .attr("x", 0)
      .attr("y", function(data, index) {
        return y(index);
      })
      .attr('width', function(data) {
        if (x(data.shotCount) > width) {
          return width;
        } else {
          return x(data.shotCount);
        }
      })
      .attr('height', rowWidth - 1)

    .on('mouseover.hideotherspots', function(d, i) {
        filter('movieTableHover', d, i);
      })
      .on('mouseout.showallspots', function(d, i) {
        filter('movieTableHoverEnd', '', '');
      });
    // 	.on('mouseover.dst', dstSelected)
    // //	.on('mouseout', tip_circle.hide)
    // 	.on('mousedown', sourceSelected);


    svg.selectAll(".lca-movie-label")
      .data(data)
      .enter().append('text')
      .attr('class', 'lca-movie-label')
      .attr('x', 0)
      .attr('y', function(data, index) {
        return y(index) - 10;
      })
      .attr('dy', '.16em')
      .text(function(data) {
        return data.title
      });

  });

  exports.reloadMovieWithTimePeriod = function(timePeriod) {
    var duration = 200;
    var timePeriodFile = 'data/movies/movies_' + timePeriod + '.json';
    console.log('reloadMovieWithTimePeriod: ' + timePeriodFile);

    svg.selectAll(".lca-movie, .lca-movie-label")
      .transition()
      .duration(duration)
      .ease("quad")
      .style('opacity', 0);


    setTimeout(function() {
      d3.json(timePeriodFile, function(error, data) {
        console.log('reloadMovieWithTimePeriod: data loaded');

        var movieRow = svg.selectAll(".lca-movie")
          .data(data);

        movieRow.enter().append("rect")
          .attr("class", "lca-movie");

        movieRow
          .attr("x", 0)
          .attr("y", function(data, index) {
            return y(index);
          })
          .attr('width', function(data) {
            if (x(data.shotCount) > width) {
              return width;
            } else {
              return x(data.shotCount);
            }
          })
          .attr('height', rowWidth - 1)
          .on('mouseover.hideotherspots', function(d, i) {
            filter('movieTableHover', d, i);
          })
          .on('mouseout.showallspots', function(d, i) {
            filter('movieTableHoverEnd', '', '');
          });;

        var movieLabel = svg.selectAll('.lca-movie-label')
          .data(data);

        movieLabel.enter().append('text')
          .attr('class', 'lca-movie-label')

        movieLabel
          .attr('x', 0)
          .attr('y', function(data, index) {
            return y(index) - 10;
          })
          .attr('dy', '.16em')
          .text(function(data) {
            return data.title
          })
          .on('mouseover.hideotherspots', function(d, i) {
            filter('movieTableHover', d, i);
          })
          .on('mouseout.showallspots', function(d, i) {
            filter('movieTableHoverEnd', '', '');
          });;


        svg.selectAll(".lca-movie, .lca-movie-label")
          .transition()
          .duration(duration)
          .ease("quad")
          .style('opacity', 1);

        movieLabel.exit().remove();
        movieRow.exit().remove();
      });
    }, duration);
  };
  return exports;
}();





// var weekDay = function() {
//     var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//     var exports = {};
//     exports.name = function(number) {
//         return names[number];
//     };
//     exports.number = function(name) {
//         return names.indexOf(name);
//     };
//     return exports;
// }();

// console.log(weekDay.name(weekDay.number('Sunday')));





// lca-movie-table
// var reloadMovieTableWithTimeZone = function (timePeriod) {
// 	movieTableFile = 'data/movies/movies_' + timePeriod + '.json';
//     d3.json(movieTableFile, function(error, data) {
// 	// console.log('d3 data loaded');
// 	React.render(
// 		React.createElement(MovieTitleTable, {data: data}),
// 		document.getElementById('lca-movie-table')
// 	);
// 	// console.log(data);
// });
// }



//                 // <td class='sg-cell-chart'><div class='sg-cell-chart sg-cell-chart-training' style="width: 5%;"><p class='sg-cell-chart'>Boost Media</p></div></td>
// var LikeButton = React.createClass({
//   getInitialState: function() {
//     return {liked: false};
//   },
//   handleClick: function(event) {
//     this.setState({liked: !this.state.liked});
//   },
//   render: function() {
//     var text = this.state.liked ? 'like' : 'haven\'t liked';
//     return (
//       <p onClick={this.handleClick}>
//         You {text} this. Click to toggle.
//       </p>
//     );
//   }
// });

// React.render(
//   <LikeButton />,
//   document.getElementById('example')
// );
