var margin = {top: 5, right: 5, bottom: 5, left: 5},
	width = 233 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

var canvas = d3.select("#active").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

var dataset = [23,100];

canvas.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x",function(d,i){return i * width/dataset.length;})
	.attr("y",function(d){return height - d;})
	.attr("width", width/dataset.length)
	.attr("height", function(d){return d;});