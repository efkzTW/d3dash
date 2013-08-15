var dataset = [];
for (var i = 0; i < 20; i++) {
	var newNum = Math.floor(Math.random() * 100);
	dataset.push(newNum);
}

var w = 525;
var h = 200;
var margin = 2;
svg = d3.select("#stb-bar")
		.append("svg")
		.attr({
			width: w,
			height: h
		});

svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr({
		x: function(d,i) {return i * (w/dataset.length) + margin},
		y: function(d) {return h - (h/100 * d)},
		width: w/dataset.length - 2 * margin,
		height: function(d) { return d},
		"fill": "#000"
	});