
var margin = {top: 10, right: 20, bottom: 25, left: 50},
	width = 500 - margin.left - margin.right,
	height = 220 - margin.top - margin.bottom;

var x = d3.time.scale()
		.range([0,width]);

var y = d3.scale.linear()
		.range([height, 0]);

var parseDate = d3.time.format("%m/%d/%Y").parse;

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var line = d3.svg.line()
		.x(function(d){return x(d.date);})
		.y(function(d){return y(d.total);});

var svg = d3.select("#stb-line").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("stb_data.csv", function(error, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.total = +d.total;
	});

	x.domain(d3.extent(data, function(d) {return d.date;}));
	y.domain(d3.extent(data, function(d) {return d.total;}));

	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("(activations)");

	svg.append("text")
		.attr("transform", "translate(300,10)")
		.text("High: ");

	svg.append("text")
		.attr("transform", "translate(300, 30)")
		.text("Low: ");

	svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line);
});