var dimWidth = 192;
var dimHeight = 50;

var margin = {top: 0, right: 20, bottom: 0, left: 45},
	width = dimWidth - margin.left - margin.right,
	height = dimHeight - margin.top - margin.bottom;

var canvas = d3.select("#daily-h").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = [{"val":45,"key":"TaiEx"}, {"val":35,"key":"Combo"},
				{"val":15,"key":"Upgrade"},{"val":5,"key":"TW"}];

var x = d3.scale.linear()
		.domain([0,d3.max(dataset, function(d){return d.val;})])
		.range([0,width]);

var y = d3.scale.ordinal()
		.domain(dataset.map(function(d){return d.key;}))
		.rangeRoundBands([0,height], 0.15);

var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

canvas.selectAll("rect").data(dataset)
		.enter()
		.append("rect")
			.attr("x", function(d){return 0;})
			.attr("y", function(d,i){return y(d.key);})
			.attr("width", function(d){return 0;})
			.attr("height", function(d){return y.rangeBand();})
			.transition()
			.delay(500)
			.duration(1000)
			.attr("width", function(d){return x(d.val);});


canvas.selectAll("text").data(dataset)
		.enter()
		.append("text")
			.attr("class", "text")
			.text(0)
			.attr("x", function(d){return 2;})
			.attr("y", function(d,i){return y(d.key) + 8;})
			.transition()
			.delay(500)
			.duration(1000)
			.text(function(d){return d.val;})
			.attr("x", function(d){return x(d.val) + 2;});

canvas.append("g")
		.attr("class", "y axis")
		.attr("transform","translate(" + 4 + ",0)")
		.call(yAxis);


