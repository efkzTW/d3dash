function buildBarChart(dataset,DOM,marginArray,dimArray,gap) {	
	var margin = {top: marginArray.top, right: marginArray.right, bottom: marginArray.bottom, left: marginArray.left},
		width = dimArray.width - margin.left - margin.right,
		height = dimArray.height - margin.top - margin.bottom;

	var canvas = d3.select(DOM).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dataset = dataset;

	var x = d3.scale.ordinal()
			.domain(dataset.map(function(d){return d.key;}))
			.rangeRoundBands([0,width],gap);

	var y = d3.scale.linear()
			.domain([0,d3.max(dataset, function(d){return d.val;})])
			.range([height,0]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")

	canvas.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
			.attr("x",function(d,i){return x(d.key);})
			.attr("y",function(d){return height;})
			.attr("width", x.rangeBand())
			.attr("height",0)
			.transition()
			.delay(500)
			.duration(1000)
			.attr("y", function(d){return y(d.val);})
			.attr("height", function(d){return height-y(d.val);});

	canvas.selectAll("text")
			.data(dataset)
			.enter()
		.append("text")
			.attr("x", function(d,i){return x(d.key) + x.rangeBand()/2;})
			.attr("y", height-2)
			.attr("class", "text")
			.style("text-anchor", "middle")
			.text(0)
			.transition()
			.delay(500)
			.duration(1000)
			.text(function(d){return d.val;})
			.attr("y", function(d){return (y(d.val)-2);});

	canvas.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height - 5) + ")")
			.call(xAxis);
}

var margins = {top: 10, bottom: 15, left: 5, right: 5};
var dims = {width: 192, height: 192};

var dataset1 = [{"val":1762,"key":"TW"},{"val":29296,"key":"NTB"}];
buildBarChart(dataset1, "#active", margins, dims, .2);

var overviewCharts = {0: "#daily-tw", 1:"#daily-ntb", 2: "#weekly-tw", 
						3:"#weekly-ntb", 4: "#monthly-tw", 5:"#monthly-ntb"};

var dataset2 = [{"val":1,"key":"A"},{"val":2,"key":"B"},{"val":3,"key":"C"},
				{"val":4,"key":"D"},{"val":5,"key":"E"},{"val":6,"key":"F"},
				{"val":7,"key":"G"}];
for (var i = 0; i<=8; i++) {
	buildBarChart(dataset2, overviewCharts[i], margins, {width:180,height:50},.3);
}
