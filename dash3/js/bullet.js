function buildBullet(dataSrc, id, outputType) {
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
		
		//store data of the specified voucher type
		var dataset = [];
		//store both TaiEx and Combo sales in order to find max xAxis scale
		var dataset2 = [];

		for (perDate in json) {
			if (parseDate(perDate) !== null) {
			 	dataset.push({date:perDate, valNew:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key3], valRe:json[perDate][dataSrc.key1][dataSrc.key2][dataSrc.key4]});
			 	dataset2.push({date:perDate, valNew:json[perDate]["5"]["Combo"][dataSrc.key3], valRe:json[perDate]["5"]["Combo"][dataSrc.key4],
								valNew2:json[perDate]["5"]["TaiEx"][dataSrc.key3], valRe2:json[perDate]["5"]["TaiEx"][dataSrc.key4]});
			}
		}

		dataset.forEach(function(d){
			d.valNew = +d.valNew;
			d.valSum = +d.valNew + d.valRe;
		});

		// switch case on determining xAxis max length
		switch (outputType){
			case "monthly":
				dataset2.push({"valSum":(dataset2[0]["valNew"]+dataset2[0]["valRe"]), 
								"valSum2":(dataset2[0]["valNew2"]+dataset2[0]["valRe2"])});
				break;

			case "weekly":
				//find week day
				var maxDate = parseDate(dataset[0]["date"]).getUTCDay();
				
				var sumNew = 0, sumTotal = 0;
				var sumTotal1 = 0, sumTotal2 = 0;
				//loop through each date in the weekly report
				dataset.forEach(function(d){

					
					if (parseDate(d["date"]).getUTCDay() <= maxDate) {
						//console.log("true");
						sumNew = sumNew + d["valNew"];
						sumTotal = sumTotal + d["valSum"];
					}
				});

				dataset.unshift({"valNew": sumNew, "valSum": sumTotal});


				dataset2.forEach(function(d){
					if (parseDate(d["date"]).getUTCDay() <= maxDate) {
						sumTotal1 = sumTotal1 + d["valNew"] + d["valRe"];
						sumTotal2 = sumTotal2 + d["valNew2"] + d["valRe2"];
					}
				});
				dataset2.push({"valSum": sumTotal1, "valSum2": sumTotal2});

				//console.log("new: " + sumNew);
				//console.log("total: " + sumTotal);
				

				//dataset2.push({"valSum":sumNew, "val"})

				break;

			default:
				dataset2.forEach(function(d){
					d.valSum = +d.valNew + d.valRe;
					d.valSum2 = +d.valNew2 + d.valRe2;
				});
				break;
		}

		//console.log(dataset2);

		var bulletMax = d3.max([d3.max(dataset2, function(d) {return d.valSum;}), d3.max(dataset2, function(d) {return d.valSum2;})])

		//console.log(bulletMax);
		xScale.domain([0,bulletMax]);

		//console.log(dataset[0].valSum);

		canvas.append("rect")
					.attr("class", "bulletSum")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", 0)
					.attr("height", height *.9)
					.attr("rx",3)
					.attr("ry",3)
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
					.text("+" + dataset[0].valNew);


		canvas.append("text")
					.attr("class", "bulletText total")
					.attr("x",0)
					.attr("y", height*.9 * 2/3)
					.text("")
					.transition()
					.delay(500)
					.duration(1000)
					.attr("x", xScale(dataset[0].valSum) + 2)
					.text(dataset[0].valSum);

		canvas.append("text")
					.attr("class", "bulletText label")
					.attr("x", 0)
					.attr("y", -2)
					.text(dataSrc.key2);

		canvas.append("g")
				.attr("class", "bullet axis")
				.attr("transform", "translate(0," + (height-1) + ")")
				.call(xAxis);
	});
}

//buildBullet({rawData: jsonYesterdayURL, key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#d-bul-combo");
//buildBullet({rawData: jsonYesterdayURL, key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#d-bul-taiex");

//buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#w-bul-combo");
//buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#w-bul-taiex");

//buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#m-bul-combo");
//buildBullet({rawData:"data/daily_report.json", key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#m-bul-taiex");