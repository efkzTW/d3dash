function buildLineGraph(dataSrc,id){

	var fullWidth = 300, fullHeight= 100;
	var margin = {top: 10, right: 20, bottom: 20, left: 20},
		width = fullWidth - margin.left - margin.right,
		height = fullHeight - margin.top - margin.bottom;

	var xScale = d3.time.scale()
			.range([0,width])

	var yScale = d3.scale.linear()
			.range([height,0]);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(d3.time.days, 1);

	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	var line = d3.svg.line()
			.x(function(d){return xScale(d.date);})
			.y(function(d){return yScale(d.valSum);});

	var canvas = d3.select(id).append("svg")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(dataSrc.rawData, function(error, json) {
		if (error) {return console.warn(error);}
		var dataset = [];

		for (perDate in json) {
			if (parseDate(perDate) !== null) {
				dataset.push({date:perDate, valNew:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key3], 
						valRe:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key4]});
			}
		}

		dataset.forEach(function(d){
			d.date = parseDate(d.date);
			d.valNew = +d.valNew;
			d.valRe = +d.valRe;
			d.valSum = +d.valNew + d.valRe;
			return d;
		});

		//console.log(dataset);
		dataset.sort(function(a,b){return a.date-b.date;});

		yScale.domain([0, d3.max(dataset, function(d){return d.valSum;})]);
		xScale.domain(d3.extent(dataset, function(d){return d.date;}));

		canvas.append("path")
			.datum(dataset)
			.attr("class", "line")
			.attr("d", line);

		canvas.append("g")
				.attr("class", "xLine axis")
				.attr("transform","translate(0," + (height) + ")")
				.call(xAxis);

		canvas.append("g")
				.attr("class", "yLine axis")
				.call(yAxis);
	});

}

buildLineGraph({rawData:"data/daily_report.json",key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-7")
buildLineGraph({rawData:"data/daily_report.json",key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-14")
buildLineGraph({rawData:"data/daily_report.json",key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-21")