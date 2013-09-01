
var fullWidth = 318, fullHeight= 100;
var margin = {top: 10, right: 10, bottom: 15, left: 10},
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;

var xScale = d3.time.scale()
		.range([0,width])

var yScale = d3.scale.linear()
		.range([height,0]);

var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(yAxis)
		.orient("left");

var parseDate = d3.time.format("%Y-%m-%d").parse;

var line = d3.svg.line()
		.x(function(d){return xScale(d.date);})
		.y(function(d){return yScale(d.valSum);});

var canvas = d3.select("#trend-7").append("svg")
		.attr("width", fullWidth)
		.attr("height", fullHeight)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/daily_report.json", function(error, json) {
	if (error) {return console.warn(error);}
	var dataset = [];

	for (perDate in json) {
		if (parseDate(perDate) !== null) {
			dataset.push({date:perDate, valNew:json[perDate]["5"]["Combo"]["DN"], 
					valRe:json[perDate]["5"]["Combo"]["DR"]});
		}
	}

	dataset.forEach(function(d){
		d.date = parseDate(d.date);
		d.valNew = +d.valNew;
		d.valRe = +d.valRe;
		d.valSum = +d.valNew + d.valRe;
		return d;
	});

	console.log(dataset);
	dataset.sort(function(a,b){return a.date-b.date;});

	yScale.domain([0, d3.max(dataset, function(d){return d.valSum;})]);
	xScale.domain(dataset.map(function(d){return d.date;}));

	canvas.append("path")
		.datum(dataset)
		.attr("class", "line")
		.attr("d", line);
});



