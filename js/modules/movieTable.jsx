var MovieTitleRow = React.createClass({
	handleClick: function(event) {
		console.log(this.props.data);
		console.log('movie title clicked');
		// updateMap(this.props.data.title);
	},
	render: function() {
		return(
		<td onClick={this.handleClick} className='lca-cell-chart'>
			<div className='lca-cell-chart' style={this.props.data.style}>
				<p className='lca-cell-chart'>{this.props.data.title}</p>
			</div>
		</td>
		)
	}
});

var MovieTitleTable = React.createClass({
	render: function() {
		var movieRows = this.props.data.map(function (rowData) {
			var rowWidth = '10%';
			if(rowData.shotCount*10>100){ rowWidth = '100%'; }
			else{ rowWidth = String(rowData.shotCount*10)+'%'}

			rowData.style = {width: rowWidth};
			// var rowWidthStyle = {width: rowWidth};
			return(
				<tr>
					<MovieTitleRow data={rowData}/>
				</tr>
				);
		}.bind(this));
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
		<MovieTitleTable data={data}/>,
		document.getElementById('lca-movie-table')
	);
	// console.log(data);
});


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
