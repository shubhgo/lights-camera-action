var MovieTitleRow = React.createClass({
	render: function() {
		var movieRows = this.props.data.map(function (rowData) {
			var rowWidth = '10%';
			if(rowData.shotCount*10>100){ rowWidth = '100%'; }
			else{ rowWidth = String(rowData.shotCount*10)+'%'}

			var rowWidthStyle = {width: rowWidth};
			return(
				<tr>
					<td className='lca-cell-chart'>
						<div className='lca-cell-chart' style={rowWidthStyle}>
							<p className='lca-cell-chart'>{rowData.title}</p>
						</div>
					</td>
				</tr>
				);
		});
		return (
			<div>
			{movieRows}
			</div>
		)
	}
});

d3.json("data/movies_1990.json", function(error, data) {
	// console.log('d3 data loaded');
	React.render(
		<MovieTitleRow data={data}/>,
		document.getElementById('lca-movie-table')
	);
	// console.log(data);
});


                // <td class='sg-cell-chart'><div class='sg-cell-chart sg-cell-chart-training' style="width: 5%;"><p class='sg-cell-chart'>Boost Media</p></div></td>
