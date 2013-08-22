
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

var dateMinFilter = parseDate("4/1/2013");
var dateMaxFilter = parseDate("5/1/2013");

d3.csv("../data/stb_data.csv", function(error, data) {
	console.log(data)
	data = data.filter(function(obj) {
		if (parseDate(obj.date) >= dateMinFilter && parseDate(obj.date) <= dateMaxFilter) {
			return obj;
		};
	});
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