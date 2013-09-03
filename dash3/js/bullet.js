function buildBullet(dataSrc, id) {
	var fullWidth = 318;
	var fullHeight = 50;
	var margin = {top:15, right: 20, bottom: 15, left: 10},
		width = fullWidth - margin.left - margin.right,
		height = fullHeight - margin.top - margin.bottom;

	var xScale = d3.scale.linear()
				.range([0,width]);

	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

	var canvas = d3.select(id).append("svg")
				.attr("width", fullWidth)
				.attr("height", fullHeight)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	d3.json(dataSrc.rawData, function(error, json) {
		if (error) {return console.warn(error);}
		var dataset = [];
		var dataset2 =[]
		for (perDate in json) {
			if (parseDate(perDate) !== null) {
				dataset.push({date:perDate, valNew:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key3], valRe:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key3]});
			}
		}
		for (perDate in json) {
			if (parseDate(perDate) !== null) {
				dataset2.push({date:perDate, valNew:json[perDate]["5"]["Combo"]["DN"], valRe:json[perDate]["5"]["Combo"]["DR"],
								valNew2:json[perDate]["5"]["TaiEx"]["DN"], valRe2:json[perDate]["5"]["TaiEx"]["DR"]});
			}
		}

		dataset.forEach(function(d){
			d.valNew = +d.valNew;
			d.valSum = +d.valNew + d.valRe;
		});

		dataset2.forEach(function(d){
			d.valSum = +d.valNew + d.valRe;
			d.valSum2 = +d.valNew2 + d.valRe2;
		})

		var latestDate = d3.max(dataset, function(d) {return d.date;});
		
		var bulletMax = d3.max([d3.max(dataset2, function(d) {return d.valSum;}), d3.max(dataset2, function(d) {return d.valSum2;})])

		console.log(bulletMax);
		xScale.domain([0,bulletMax]);

		//console.log(dataset[0].valSum);

		canvas.append("rect")
					.attr("class", "bulletSum")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", 0)
					.attr("height", height *.9)
					.transition()
					.delay(500)
					.duration(1000)
					.attr("width", xScale(dataset[0].valSum));

		canvas.append("rect")
					.attr("class", "bulletNew")
					.attr("x", 0)
					.attr("y", height*.9/3)
					.attr("width", 0)
					.attr("height", height *.30)
					.transition()
					.delay(800)
					.duration(1000)
					.attr("width", xScale(dataset[0].valNew));

		canvas.append("text")
					.attr("class", "bulletText new")
					.attr("x",0)
					.attr("y", height*.9 * 2/3)
					.text("")
					.transition()
					.delay(800)
					.duration(1000)
					.attr("x", xScale(dataset[0].valNew) + 2)
					.text(dataset[0].valNew + " new");

		canvas.append("text")
					.attr("class", "bulletText total")
					.attr("x", 0)
					.attr("y", -2)
					.text(dataSrc.key2);

		canvas.append("g")
				.attr("class", "bullet axis")
				.attr("transform", "translate(0," + (height-1) + ")")
				.call(xAxis);
	});
}

buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#d-bul-combo");
buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#d-bul-taiex");

buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#w-bul-combo");
buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#w-bul-taiex");

buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#m-bul-combo");
buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#m-bul-taiex");