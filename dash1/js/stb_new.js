function buildLineChart(file, targID, marginArray, dimenArray){

	var margin = {top: marginArray.top, right: marginArray.right, bottom: marginArray.bottom, left: marginArray.left},
		width = dimenArray.width - margin.left - margin.right,
		height = dimenArray.height - margin.top - margin.bottom;

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

	var svg = d3.select(targID).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dateMinFilter = parseDate("5/1/2013");
	var dateMaxFilter = parseDate("7/31/2013");

	d3.csv(file, function(error, data) {

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
			  .attr("x", 45)
			  .attr("y", -15)
			  .attr("dy", ".65em")
			  .style("text-anchor", "end")
			  .text("activations");


		var totalMax = d3.max(data, function(d){return d.total});
		var totalMin = d3.min(data, function(d){return d.total});
		var totalAvg = Math.floor(d3.sum(data, function(d){return d.total})/data.length) + 1;

		var labelWidth = width + margin.left + margin.right;

		/* can try see if can make vertical data labels dynamic by 
			having max/avg/min aligned with the x-axis */

		var textLabels = svg.append("g")
			.attr("class", "text-labels")
			.attr("font-size", "13px");
			textLabels.append("text")
				.attr("transform", "translate(" + (labelWidth *.93) + "," + (height * 0 + 15) + ")")
				.text("Max.");
			textLabels.append("text")
				.attr("transform", "translate(" + (labelWidth *.93) + "," + (height *.33 + 15) + ")")
				.text("Avg.");
			textLabels.append("text")
				.attr("transform", "translate(" + (labelWidth * .93) + "," + (height *.66 + 15) + ")")
				.text("Min.");

		var textNums = svg.append("g")
			.attr("class", "text-nums")
			.attr("font-size","30px")
			.attr("fill", "red");
		textNums.append("text")
			.attr("transform", "translate(" + (labelWidth *.93 - 4) + "," + (height * 0 + 45) + ")")
			.text(totalMax);
		textNums.append("text")
			.attr("transform", "translate(" + (labelWidth *.93 - 4) + "," + (height * .33 + 45) + ")")
			.text(totalAvg);
		textNums.append("text")
			.attr("transform", "translate(" + (labelWidth *.93 - 4) + "," + (height * .66 + 45) + ")")
			.text(totalMin);

		svg.append("path")
			  .datum(data)
			  .attr("class", "line")
			  .attr("d", line);
	});
}

var chartMargins = {top: 30, right: 60, bottom: 30, left: 30};
var chartDims = {width: 799, height: 250};

buildLineChart("../data/stb_data.csv","#ntb-line", chartMargins, chartDims);
buildLineChart("../data/stb_data.csv","#tw-line", chartMargins, chartDims);
