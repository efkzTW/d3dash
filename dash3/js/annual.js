function buildAnnualBar(){
var fullWidth = 319;
var fullHeight = 309;
var margin = {top: 15, right: 10, bottom: 19, left: 20},
	width = fullWidth - margin.left - margin.right,
	height = fullHeight - margin.top - margin.bottom;

var dataset = [{year:"2010", val: 1000},
			   {year:"2011", val: 15000},
			   {year:"2012", val: 25000},
			   {year:"2013", val: 30000}];

var xScale = d3.scale.ordinal()
		.domain(dataset.map(function(d){return d.year;}))
		.rangeRoundBands([0,width],.2);

var yScale = d3.scale.linear()
		.domain([0,d3.max(dataset, function(d){return d.val;})])
		.range([height,0]);

var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

var canvas = d3.select("#annual").append("svg")
		.attr("width", fullWidth)
		.attr("height", fullHeight)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

canvas.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
			.attr("x", function(d,i){return xScale(d.year);})
			.attr("y", function(d){return height;})
			.attr("width", xScale.rangeBand())
			.attr("height", 0)
			.transition()
			.delay(500)
			.duration(1000)
			.attr("y", function(d){return yScale(d.val);})
			.attr("height",function(d){return height-yScale(d.val);});

canvas.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
			.attr("x", function(d,i){return xScale(d.year) + xScale.rangeBand()/2;})
			.attr("y", height-2)
			.attr("class", "annual text")
			.style("text-anchor", "middle")
			.text(0)
				.transition()
				.delay(500)
				.duration(1000)
			.text(function(d){return d.val;})
			.attr("y", function(d){return yScale(d.val)-2;});

canvas.append("g")
		.attr("class","annual xAxis")
		.attr("transform","translate(0," + (height-5) + ")")
		.call(xAxis);
}