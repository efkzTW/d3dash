var dimWidth = 192;
var dimHeight = 50;

var margin = {top: 0, right: 20, bottom: 0, left: 40},
	width = dimWidth - margin.left - margin.right,
	height = dimHeight - margin.top - margin.bottom;

var canvas = d3.select("#daily-h").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = [45, 35, 15, 5];

var x = d3.scale.linear()
		.domain([0,d3.max(dataset)])
		.range([0,width]);

var y = d3.scale.ordinal()
		.domain(d3.range(dataset.length))
		.rangeRoundBands([0,height], 0.15);

var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

canvas.selectAll("rect").data(dataset)
		.enter()
		.append("rect")
			.attr("x", function(d){return 0;})
			.attr("y", function(d,i){return y(i);})
			.attr("width", function(d){return 0;})
			.attr("height", function(d){return y.rangeBand();})
			.transition()
			.delay(500)
			.duration(1000)
			.attr("width", function(d){return x(d);});


canvas.selectAll("text").data(dataset)
		.enter()
		.append("text")
			.attr("class", "text")
			.text(0)
			.attr("x", function(d){return 2;})
			.attr("y", function(d,i){return y(i) + 8;})
			.transition()
			.delay(500)
			.duration(1000)
			.text(function(d){return d;})
			.attr("x", function(d){return x(d) + 2;});

canvas.append("g")
		.attr("class", "y axis")
		.call(yAxis);


