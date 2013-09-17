function buildLineGraph(dataSrc,id, outputType){

	var fullWidth = 300, fullHeight= 150;
	var margin = {top: 10, right: 40, bottom: 40, left: 25},
		width = fullWidth - margin.left - margin.right,
		height = fullHeight - margin.top - margin.bottom;

	var xScale = d3.time.scale()
			.range([0,width])

	var yScale = d3.scale.linear()
			.range([height,0]);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.tickFormat(d3.time.format("%m/%d"));

	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(5);

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	var line = d3.svg.line()
			.x(function(d){return xScale(d.date);})
			.y(function(d){return yScale(d.valTotal);});

	var canvas = d3.select(id).append("svg")
			.attr("width", fullWidth)
			.attr("height", fullHeight)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	


	switch(outputType){

		case "7days":
			var sourceArray = [dataSrc.rawData];

			d3.json(sourceArray[0], function(error, json) {
				var v1 = [], v2 = [], v3 = [];
				if (error) {return console.warn(error);}
				for (perDate in json) {
					if (parseDate(perDate) !== null) {
						v1.push({date:perDate, valTotal:json[perDate][dataSrc.key1][dataSrc.key2[0]][dataSrc.key3]});
						v2.push({date:perDate, valTotal:json[perDate][dataSrc.key1][dataSrc.key2[1]][dataSrc.key3]});
						v3.push({date:perDate, valTotal:json[perDate][dataSrc.key1][dataSrc.key2[2]][dataSrc.key3]});
					}
				}
				//generate graph
				genGraph(v1,v2,v3,1);
			});
			break;

		case "14days":
			//find previous week date
			var prevWeek = parseDate(dataSrc.rawData[0].slice(-10));
			//console.log(lastWeek);
			prevWeek.setDate(prevWeek.getDate()-7);
			var strPrevWeek = prevWeek.getFullYear() + "-" + ("0" + (prevWeek.getMonth()+1)).slice(-2) + "-" + ("0" + prevWeek.getDate()).slice(-2);
			//console.log(lastWeek);
			var sourceArray = [dataSrc.rawData[0],dataSrc.rawData[0].slice(0,dataSrc.rawData[0].length-10) + strPrevWeek]
			//console.log(dataSrc.rawData[0].slice(0,dataSrc.rawData[0].length-10) + strPrevWeek);
			d3.json(sourceArray[0], function(error, json1) {
				
				d3.json(sourceArray[1], function(error, json2) {
					var v1 = [], v2 = [], v3 = [];
					if (error) {return console.warn(error);}

					var jsonArray = [json1, json2];
					for (var i = 0; i<jsonArray.length;i++) {
						for (perDate in jsonArray[i]) {
							if (parseDate(perDate) !== null) {
								v1.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[0]][dataSrc.key3]});
								v2.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[1]][dataSrc.key3]});
								v3.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[2]][dataSrc.key3]});
							}
						}
					}

				//generate graph
				genGraph(v1,v2,v3,1);
				
				});
			});

			break;

		case "21days":

			var secondWeek = parseDate(dataSrc.rawData[0].slice(-10));
			var thirdWeek = parseDate(dataSrc.rawData[0].slice(-10));

			//console.log(lastWeek);
			secondWeek.setDate(secondWeek.getDate()-7);
			//console.log(secondWeek);
			thirdWeek.setDate(thirdWeek.getDate()-14);
			var strSecond = secondWeek.getFullYear() + "-" + ("0" + (secondWeek.getMonth()+1)).slice(-2) + "-" + ("0" + secondWeek.getDate()).slice(-2);
			var strThird = thirdWeek.getFullYear() + "-" + ("0" + (thirdWeek.getMonth()+1)).slice(-2) + "-" + ("0" + thirdWeek.getDate()).slice(-2);
			//console.log(lastWeek);
			var sourceArray = [dataSrc.rawData[0],dataSrc.rawData[0].slice(0,dataSrc.rawData[0].length-10) + strSecond,
								dataSrc.rawData[0].slice(0,dataSrc.rawData[0].length-10) + strThird]
			d3.json(sourceArray[0], function(error, json1) {
				d3.json(sourceArray[1], function(error, json2) {
					d3.json(sourceArray[2], function(error, json3) {
						var v1 = [], v2 = [], v3 = [];
						if (error) {return console.warn(error);}

						var jsonArray = [json1, json2, json3];
						for (var i = 0; i<jsonArray.length;i++) {
							for (perDate in jsonArray[i]) {
								if (parseDate(perDate) !== null) {
									v1.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[0]][dataSrc.key3]});
									v2.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[1]][dataSrc.key3]});
									v3.push({date:perDate, valTotal:jsonArray[i][perDate][dataSrc.key1][dataSrc.key2[2]][dataSrc.key3]});
								}
							}
						}

					//generate graph
					genGraph(v1,v2,v3,2);
				
					});
				});
			});

			break;
	}

	

	//wrap graph generator after gather all data
	function genGraph(v1_data, v2_data, v3_data, tickCount) {

		var dataArray = [v1_data, v2_data, v3_data];
		//var dataArray = [v1_data, v2_data];

		for (var i = 0; i<dataArray.length; i++){

			dataArray[i].forEach(function(d){
			d.date = parseDate(d.date);
			d.valTotal = +d.valTotal;
			return d;
			});

			dataArray[i].sort(function(a,b){return a.date-b.date;});
		}

		yScale.domain([0, d3.max([d3.max(dataArray[0], function(d){return d.valTotal;}),d3.max(dataArray[1], function(d){return d.valTotal;})])]);
		xScale.domain(d3.extent(dataArray[0], function(d){return d.date;}));
		xAxis.ticks(d3.time.days, tickCount);
		canvas.append("path")
			.datum(dataArray[0])
			.attr("class", "line1 Combo")
			.attr("d", line);

		canvas.append("path")
			.datum(dataArray[1])
			.attr("class", "line2 TaiEx")
			.attr("d", line);

		canvas.append("path")
			.datum(dataArray[2])
			.attr("class", "line3")
			.attr("d", line);

		canvas.append("g")
				.attr("class", "xLine axis")
				.attr("transform","translate(0," + (height) + ")")
				.call(xAxis)
			.selectAll("text")
				.attr("x",-8)
				.attr("y",0)
				.attr("transform","rotate(-65)")
				.style("text-anchor", "end");

		canvas.append("g")
				.attr("class", "yLine axis")
				.call(yAxis);

		canvas.append("text")
				.attr("class","lineText voucher")
				.attr("x", xScale(dataArray[1][dataArray[1].length-1]["date"])+3)
				.attr("y", yScale(dataArray[1][dataArray[1].length-1]["valTotal"])+3)
				.text("TaiEx");

		canvas.append("text")
				.attr("class","lineText voucher")
				.attr("x", xScale(dataArray[0][dataArray[0].length-1]["date"])+3)
				.attr("y", yScale(dataArray[0][dataArray[0].length-1]["valTotal"])+3)
				.text("Combo");

		canvas.append("text")
				.attr("class","lineText voucher")
				.attr("x", xScale(dataArray[2][dataArray[2].length-1]["date"])+3)
				.attr("y", yScale(dataArray[2][dataArray[2].length-1]["valTotal"])+3)
				.text("Deluxe");
	}
		
}

//buildLineGraph({rawData:jsonYesterdayURL,key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-7")
//buildLineGraph({rawData:"data/daily_report.json",key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-14")
//buildLineGraph({rawData:"data/daily_report.json",key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-21")