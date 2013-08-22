
var margin = {top: 30, right: 50, bottom: 30, left: 30},
	width = 470 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;

var x = d3.time.scale()
		.range([0,width]);

var y = d3.scale.linear()
		.range([height, 0]);

var parseDate = d3.time.format("%m/%d/%Y").parse;

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(d3.time.months, 1);

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

var dateMinFilter = parseDate("3/1/2013");
var dateMaxFilter = parseDate("5/1/2013");

d3.csv("../data/stb_data.csv", function(error, data) {

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
		  .attr("x", 80)
		  .attr("y", 0)
		  .attr("dy", ".65em")
		  .style("text-anchor", "end")
		  .text("activations");


	var totalMax = d3.max(data, function(d){return d.total});
	var totalMin = d3.min(data, function(d){return d.total});
	var totalAvg = Math.floor(d3.sum(data, function(d){return d.total})/data.length) + 1;

	svg.append("text")
		.attr("transform", "translate(" + (width *.4) + "," + (-5) + ")")
		.text("Max.")
		.attr("font-size", "13px");

	svg.append("text")
		.attr("transform", "translate(" + (width *.4 + 25) + "," + (-5) + ")")
		.text(totalMax)
		.attr("font-size", "30px")
		.attr("fill", "red");

	svg.append("text")
		.attr("transform", "translate(" + (width *.6) + "," + (-5) + ")")
		.text("Avg.")
		.attr("font-size", "13px");

	svg.append("text")
		.attr("transform", "translate(" + (width *.6 + 25) + "," + (-5) + ")")
		.text(totalAvg)
		.attr("font-size", "30px")
		.attr("fill", "red");

	svg.append("text")
		.attr("transform", "translate(" + (width * .8) + "," + (-5) + ")")
		.text("Min.")
		.attr("font-size", "13px");

	svg.append("text")
		.attr("transform", "translate(" + (width * .8 + 25) + "," + (-5) + ")")
		.text(totalMin)
		.attr("font-size", "30px")
		.attr("fill", "red");

	svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line);
});