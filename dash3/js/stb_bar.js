//rawDate = data, key1 = data key1, key2 = data key2, id = dom id,
function buildBarChart(dataSrc,id,xAxisFormat,yAxisRange){

	var fullWidth = 255, fullHeight= 100;
	var margin = {top: 10, right: 10, bottom: 15, left: 10},
		width = fullWidth - margin.left - margin.right,
		height = fullHeight - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	var xScale = d3.scale.ordinal()
			.rangeRoundBands([0,width],.2);

	var yScale = d3.scale.linear()
			.range([height,0]);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.tickFormat(d3.time.format(xAxisFormat));

	var canvas = d3.select(id).append("svg")
				.attr("width", fullWidth)
				.attr("height", fullHeight)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(dataSrc.rawData, function(error, json) {
		if (error) {return console.warn(error);}
		var dataset = [];

		for (perDate in json) {
			if (parseDate(perDate)!==null){
				dataset.push({date:perDate, val:json[perDate][dataSrc.key1][dataSrc.key2]});
			}
		}
		//convert string to respective datatype
		dataset.forEach(function(d){

			d.val = +d.val;
			d.date = parseDate(d.date);
			return d;
		});
		// sort object array by date
		dataset.sort(function(a,b){return a.date-b.date;}); 
		//console.log(dataset);

		yScale.domain([0,d3.max(dataset, function(d){return d.val;})]);
		xScale.domain(dataset.map(function(d){return d.date;}));

		canvas.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("x", function(d,i){return xScale(d.date);})
				.attr("y", function(d){return height;})
				.attr("width", xScale.rangeBand())
				.attr("height", 0)
				.transition()
				.delay(500)
				.duration(1000)
				.attr("y", function(d){return yScale(d.val);})
				.attr("height", function(d){return height-yScale(d.val);});
		
		canvas.selectAll("text")
			.data(dataset)
			.enter()
			.append("text")
				.attr("x", function(d,i){return xScale(d.date) + xScale.rangeBand()/2;})
				.attr("y", height-2)
				.attr("class", "text")
				.style("text-anchor", "middle")
				.text(0).transition()
						.delay(500)
						.duration(1000)
				.text(function(d){return d.val;})
				.attr("y", function(d){return (yScale(d.val)-2);})

		canvas.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height-5) + ")")
			.call(xAxis);
	});
}

buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"TD"}, "#tw-daily","%a");
buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"ND"}, "#ntb-daily","%a");
