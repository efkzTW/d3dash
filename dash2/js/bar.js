function buildBarChart(dataset,DOM,marginArray,dimArray, gap) {	
	var margin = {top: marginArray.top, right: marginArray.right, bottom: marginArray.bottom, left: marginArray.left},
		width = dimArray.width - margin.left - margin.right,
		height = dimArray.height - margin.top - margin.bottom;

	var canvas = d3.select(DOM).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dataset = dataset;

	var x = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeRoundBands([0,width],gap);

	var y = d3.scale.linear()
			.domain([0,d3.max(dataset)])
			.range([height,0]);

	canvas.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
			.attr("x",function(d,i){return x(i);})
			.attr("y",function(d){return height;})
			.attr("width", x.rangeBand())
			.transition()
			.delay(500)
			.duration(1000)
			.attr("y", function(d){return y(d);})
			.attr("height", function(d){return height-y(d);});



	canvas.selectAll("text")
			.data(dataset)
			.enter()
		.append("text")
			.attr("x", function(d,i){return x(i) + x.rangeBand()/2;})
			.attr("y", height-2)
			.attr("class", "text")
			.style("text-anchor", "middle")
			.text(0)
			.transition()
			.delay(500)
			.duration(1000)
			.text(function(d){return d;})
			.attr("y", function(d){return (y(d)-2);});
}

var margins = {top: 15, bottom: 0, left: 5, right: 5};
var dims = {width: 192, height: 342};

buildBarChart([1762, 29030+266], "#active", margins, dims, .2);

var overviewCharts = {0: "#daily-tw", 1:"#daily-ntb", 2: "#weekly-tw", 
						3:"#weekly-ntb", 4: "#monthly-tw", 5:"#monthly-ntb"};

for (var i = 0; i<=8; i++) {
	buildBarChart([1,2,3,4,5,6,7], overviewCharts[i], margins, {width:230,height:100},.3);
}
