var MovieTitleRow = React.createClass({displayName: "MovieTitleRow",
	render: function() {
		var movieRows = this.props.data.map(function (rowData) {
			var rowWidth = '10%';
			if(rowData.shotCount*10>100){ rowWidth = '100%'; }
			else{ rowWidth = String(rowData.shotCount*10)+'%'}

			var rowWidthStyle = {width: rowWidth};
			return(
				React.createElement("tr", null, 
					React.createElement("td", {className: "lca-cell-chart"}, 
						React.createElement("div", {className: "lca-cell-chart", style: rowWidthStyle}, 
							React.createElement("p", {className: "lca-cell-chart"}, rowData.title)
						)
					)
				)
				);
		});
		return (
			React.createElement("div", null, 
			movieRows
			)
		)
	}
});

d3.json("data/movies_1990.json", function(error, data) {
	// console.log('d3 data loaded');
	React.render(
		React.createElement(MovieTitleRow, {data: data}),
		document.getElementById('lca-movie-table')
	);
	// console.log(data);
});


                // <td class='sg-cell-chart'><div class='sg-cell-chart sg-cell-chart-training' style="width: 5%;"><p class='sg-cell-chart'>Boost Media</p></div></td>
