var dataset = [];
for (var i = 0; i < 20; i++) {
	var newNum = Math.floor(Math.random() * 100);
	dataset.push(newNum);
}

var w = 450;
var h = 200;
var margin = 2;
svg = d3.select("#stb-bar")
		.append("svg")
		.attr({
			width: w,
			height: h
		});

var xScale = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeBands([0,w],0.2);

svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr({
		x: function(d,i) {return xScale(i)},
		y: function(d) {return h - (h/100 * d)},
		width: xScale.rangeBand(),
		height: function(d) { return h/100*d},
		"fill": "#000"
	});