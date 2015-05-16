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
// new google.maps.LatLng(37.68, -122.55),//lower box
// new google.maps.LatLng(37.84, -122.35))

var x = d3.scale.linear()
    .range([0, width])
    .domain([mapBounds.left, mapBounds.right]);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([mapBounds.bottom, mapBounds.top]);

var color = d3.scale.category10();

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

var svg = d3.select(".lca-spot-map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/time_1990.json", function(error, data) {
    // console.log(data);
    svg.selectAll(".dot")
        .data(data)
        .enter().append("rect")
        .attr("class", "dot")
        // .attr("r", 3.5)
        .attr("x", function(d) {
            if (d.Longitude) {
                return x(d.Longitude);
            } else {
                return 0
            }
        })
        .attr("y", function(d) {
            if (d.Latitude) {
                return y(d.Latitude);
            } else {
                return 0
            }
            // return y(d.Latitude); 
        })
        .attr('width', 10)
        .attr('height', 10);
    // .style("fill", 'red' );
});

var reloadMapWithTimeZone = function(timePeriod) {
    duration = 200;
    timePeriodFile = 'data/map/map_' + timePeriod + '.json';
    console.log('reloadMapWithTimeZone: ' + timePeriodFile);
    svg.selectAll(".dot")
        .transition()
        .duration(duration)
        .ease("quad")
        .style('opacity', 0);

    setTimeout(function() {
        d3.json(timePeriodFile, function(error, data) {
            console.log('data loaded');

            var spotSquares = svg.selectAll(".dot")
                .data(data);

            spotSquares.enter().append("rect")
                .attr("class", "dot");

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
                .attr('height', 10);

            spotSquares
                .transition()
                .duration(duration)
                .ease("quad")
                .style('opacity', 1);

            spotSquares.exit().remove();
        });
    }, duration);
}

var filter = function(filter, value) {
        if (filter == 'timerperiod') {
            console.log('timeperiod ' + value);
            reloadMapWithTimeZone(value);
        };
        if (filter == 'movietable') {

        };
        if (filter == 'spotmap') {};
        if (filter == 'search') {};
    }
    // d3.tsv("data.tsv", function(error, data) {
    //   data.forEach(function(d) {
    //     d.sepalLength = +d.sepalLength;
    //     d.sepalWidth = +d.sepalWidth;
    //   });

//   x.domain(d3.extent(data, function(d) { return d.sepalWidth; })).nice();
//   y.domain(d3.extent(data, function(d) { return d.sepalLength; })).nice();

// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//   .append("text")
//     .attr("class", "label")
//     .attr("x", width)
//     .attr("y", -6)
//     .style("text-anchor", "end")
//     .text("Sepal Width (cm)");

// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis)
//   .append("text")
//     .attr("class", "label")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", ".71em")
//     .style("text-anchor", "end")
//     .text("Sepal Length (cm)")

// svg.selectAll(".dot")
//     .data(data)
//   .enter().append("circle")
//     .attr("class", "dot")
//     .attr("r", 3.5)
//     .attr("cx", function(d) { return x(d.sepalWidth); })
//     .attr("cy", function(d) { return y(d.sepalLength); })
//     .style("fill", function(d) { return color(d.species); });

// var legend = svg.selectAll(".legend")
//     .data(color.domain())
//   .enter().append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// legend.append("rect")
//     .attr("x", width - 18)
//     .attr("width", 18)
//     .attr("height", 18)
//     .style("fill", color);

// legend.append("text")
//     .attr("x", width - 24)
//     .attr("y", 9)
//     .attr("dy", ".35em")
//     .style("text-anchor", "end")
//     .text(function(d) { return d; });

// });
