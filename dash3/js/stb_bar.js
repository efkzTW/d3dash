var fullWidth = 255, fullHeight= 150;
var margin = {top: 5, right: 2, bottom: 5, left: 2},
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

d3.json("data/daily_report.json", function(error, json) {
	if (error) return console.warn(error);
	dataset = json;
	//dataset.forEach(function(d) {
		
	for (var i=0;i < Object.keys(dataset).length;i++) {
		var object = Object.keys(dataset)[i];
		if (parseDate(object) == null) {
			console.log(object + " is null");
		} else {
			console.log(object + " is date");
		}
	}
});

/*
var xScale = d3.scale.ordinal()
		.domain(dataset.map(function(d){return d.date;}))
		.range([0,width]);

var yScale = d3.scale.linear()
		.domain()
		.range();
*/
var canvas = d3.select("#tw-daily").append("svg")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
