function buildTrendLine(file, targID, marginArray, dimenArray, pastDays, product){

	var margin = {top: marginArray.top, right: marginArray.right, bottom: marginArray.bottom, left: marginArray.left},
		width = dimenArray.width - margin.left - margin.right,
		height = dimenArray.height - margin.top - margin.bottom;

	var x = d3.time.scale()
			.range([0,width]);

	var y = d3.scale.linear()
			.range([height, 0]);

	var parseDate = d3.time.format("%m/%d/%Y").parse;

	var line = d3.svg.line()
			.x(function(d){return x(d.date);})
			.y(function(d){return y(d[product]);});

	var svg = d3.select(targID).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv(file, function(error, data) {
		var lastDate = d3.max(data,function(d){return parseDate(d.date);});
		var lowerDateRange = lastDate.setDate(lastDate.getDate() - pastDays);

		data = data.filter(function(obj) {
			if (parseDate(obj.date) >= lowerDateRange) {
				return obj;
			};
		});

		data.forEach(function(d) {
			d.date = parseDate(d.date);
			d[product] = +d[product];
		});

		x.domain(d3.extent(data, function(d) {return d.date;}));
		y.domain(d3.extent(data, function(d) {return d[product];}));

		svg.append("path")
			  .datum(data)
			  .attr("class", "line")
			  .attr("d", line);
	});
}

buildTrendLine("../data/voucher_data.csv","#stb7", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 7, "stb");
buildTrendLine("../data/voucher_data.csv","#stb14", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 14, "stb");
buildTrendLine("../data/voucher_data.csv","#stb21", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 21, "stb");
buildTrendLine("../data/voucher_data.csv","#stb28", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 28, "stb");

buildTrendLine("../data/voucher_data.csv","#te7", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 7, "taiex");
buildTrendLine("../data/voucher_data.csv","#te14", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 14, "taiex");
buildTrendLine("../data/voucher_data.csv","#te21", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 21, "taiex");
buildTrendLine("../data/voucher_data.csv","#te28", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 28, "taiex");

buildTrendLine("../data/voucher_data.csv","#cb7", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 7, "combo");
buildTrendLine("../data/voucher_data.csv","#cb14", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 14, "combo");
buildTrendLine("../data/voucher_data.csv","#cb21", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 21, "combo");
buildTrendLine("../data/voucher_data.csv","#cb28", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 28, "combo");

buildTrendLine("../data/voucher_data.csv","#up7", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 7, "upgrade");
buildTrendLine("../data/voucher_data.csv","#up14", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 14, "upgrade");
buildTrendLine("../data/voucher_data.csv","#up21", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 21, "upgrade");
buildTrendLine("../data/voucher_data.csv","#up28", {top:5, right: 5, bottom: 5, left: 5}, {width: 202, height: 54}, 28, "upgrade");
