//rawDate = data, key1 = data key1, key2 = data key2, id = dom id,
function buildBarChart(dataSrc,id,xAxisFormat,outputType){

	var fullWidth = 270, fullHeight= 100;
	var margin = {top: 10, right: 25, bottom: 15, left: 25},
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

	switch(outputType){

		case "daily":
			d3.json(dataSrc.rawData, function(error, json) {
				if (error) {return console.warn(error);}
				var dataset = [];

				for (perDate in json) {
					if (parseDate(perDate)!==null){
						dataset.push({date:perDate, val:json[perDate][dataSrc.key1][dataSrc.key2]});
					}
				}
				//convert string to respective datatype
				genBarGraph(dataset)
			});

			break;

		case "weekly":
			//find 7 weeks of url
			var sourceArray = [];
			var k= parseDate(dataSrc.rawData.slice(-10)).getUTCDay() + 1;; //days from previous Sunday
			var daysBackArray = [0,k,k+7,k+14,k+21,k+28,k+36];
			//find previous sunday
			for (var j = 0; j < daysBackArray.length; j++){
				sourceArray.push(dataSrc.rawData.slice(0,dataSrc.rawData.length-10) + convertDateStr(dataSrc.rawData,daysBackArray[j],0));
			}
			//begin parsing json data
			d3.json(sourceArray[0], function(error, json0) {
				d3.json(sourceArray[1], function(error, json1) {
					d3.json(sourceArray[2], function(error, json2) {
						d3.json(sourceArray[3], function(error, json3) {
							d3.json(sourceArray[4], function(error, json4) {
								d3.json(sourceArray[5], function(error, json5) {
									d3.json(sourceArray[6], function(error, json6) {
										if (error) {return console.warn(error);}

										var dataset = [];
										var jsonArray = [json0,json1,json2,json3,json4,json5,json6];
										for (var i = 0; i < jsonArray.length; i++){
											var sumNew = 0;
											var maxDate = parseDate(jsonArray[i]["report_date"]).getUTCDay();
											//console.log(maxDate);
											for (perDate in jsonArray[i]) {
												if (parseDate(perDate)!==null && parseDate(perDate).getUTCDay() <= maxDate){
													sumNew = sumNew + (+jsonArray[i][perDate][dataSrc.key1][dataSrc.key2]);
													//console.log(jsonArray[i][perDate][dataSrc.key1][dataSrc.key2]);
												}
											}
											//console.log(sumNew);
											dataset.push({date:jsonArray[i]["report_date"], val:sumNew});
											//console.log(dataset);
										}
										//convert string to respective datatype
										genBarGraph(dataset)
									});
								});
							});	
						});	
					});	
				});
			});
			break;

		case "monthly":
			var sourceArray = [dataSrc.rawData];
			//begin loop from 1, 0 will be current month
			for (var j = 1; j < 7; j++){
				sourceArray.push(dataSrc.rawData.slice(0,dataSrc.rawData.length-10) + convertDateStr(dataSrc.rawData,0,j));
			}

			//begin parsing json data
			d3.json(sourceArray[0], function(error, json0) {
				d3.json(sourceArray[1], function(error, json1) {
					d3.json(sourceArray[2], function(error, json2) {
						d3.json(sourceArray[3], function(error, json3) {
							d3.json(sourceArray[4], function(error, json4) {
								d3.json(sourceArray[5], function(error, json5) {
									d3.json(sourceArray[6], function(error, json6) {
										if (error) {return console.warn(error);}

										var dataset = [];
										var jsonArray = [json0,json1,json2,json3,json4,json5,json6];
										for (var i = 0; i < jsonArray.length; i++){
											//for (perDate in jsonArray[i]) {

											//	if (parseDate(perDate)!==null){
											dataset.push({date:jsonArray[i]["report_date"], val:jsonArray[i][sourceArray[i].slice(-10)][dataSrc.key1][dataSrc.key2]});
													//console.log(jsonArray[i][perDate][dataSrc.key1][dataSrc.key2]);
											//	}
											//}
											//console.log(sumNew);
											//dataset.push({date:jsonArray[i]["report_date"], val:sumNew});
											//console.log(dataset);
										}

										//convert string to respective datatype
										genBarGraph(dataset)
									});
								});
							});	
						});	
					});	
				});
			});
			break;

	}

	function genBarGraph(dataset){

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

		canvas.append("rect")
			.attr("class", "rect avg")
			.attr("x", 0)
			.attr("y", height)
			.attr("width",width)
			.attr("height", 0)
			//.style("fill-opacity","0")
			.transition()
			.delay(700)
			.duration(3000)
			.attr("y", yScale(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})))
			.attr("height", height - yScale(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})));
			//.style("fill-opacity","0.8");


		canvas.selectAll("rects")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("class","bar")
				.attr("x", function(d,i){return xScale(d.date);})
				.attr("y", function(d){return height;})
				.attr("width", xScale.rangeBand())
				.attr("height", 0)
				.transition()
				.delay(500)
				.duration(1000)
				.attr("y", function(d){return yScale(d.val);})
				.attr("height", function(d){return height-yScale(d.val);});

		canvas.append("line")
			.attr("class", "line avg")
			.attr("x1", 0)
			.attr("y1", height)
			//.attr("y1", yScale(d3.mean(dataset,function(d){return d.val;})))
			.attr("x2", width)
			.attr("y2", height)
			//.attr("y2", yScale(d3.mean(dataset,function(d){return d.val;})))
			//.style("stroke-opacity","0")
			.transition()
			.delay(700)
			.duration(3000)
			//.style("stroke-opacity",".8");
			.attr("y1", yScale(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})))
			.attr("y2", yScale(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})));

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
				.attr("y", function(d){return (yScale(d.val)-2);});

/*
		canvas.append("text")
			.attr("class", "text barAvg")
			.text("Avg.")
			.attr("x", -1)
			//.attr("y", height + 3)
			.attr("y", yScale(d3.mean(dataset,function(d){return d.val;})) + 3)
			.style("text-anchor", "end")
			.style("fill-opacity","0")
			.transition()
			.delay(700)
			.duration(3000)
			.style("fill-opacity","1");
			//.attr("y", yScale(d3.mean(dataset,function(d){return d.val;})) + 3);
*/

		canvas.append("text")
			.attr("class", "text barAvg")
			.text(Math.floor(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})))
			.attr("x", width + 2)
			.attr("y", height + 3)
			//.attr("y", yScale(d3.mean(dataset,function(d){return d.val;})) + 3)
			//.style("fill-opacity","0")
			.transition()
			.delay(700)
			.duration(3000)
			//.style("fill-opacity","1");
			.attr("y", yScale(d3.mean(dataset.slice(0,dataset.length-1),function(d){return d.val;})) + 3);


		canvas.append("g")
			.attr("class", "xBar axis")
			.attr("transform", "translate(0," + (height-5) + ")")
			.call(xAxis);

	}

	function convertDateStr(url, daysBack, monthsBack) {
		if(typeof(daysBack)==="undefined") {daysBack=0;}
		if(typeof(monthsBack)==="undefined") {monthsBack=0;}
		var targetDate = parseDate(url.slice(-10));

		targetDate.setDate(targetDate.getDate()-daysBack);
		targetDate.setMonth(targetDate.getMonth()-monthsBack);

		if (monthsBack!==0) {targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth()+1,0);}

		return targetDate.getFullYear() + "-" + ("0" + (targetDate.getMonth()+1)).slice(-2) + "-" + ("0" + targetDate.getDate()).slice(-2);
	}
}

//buildBarChart({rawData:jsonYesterdayURL,key1:"4",key2:"TD"}, "#tw-daily","%a");
//buildBarChart({rawData:jsonYesterdayURL,key1:"4",key2:"ND"}, "#ntb-daily","%a");

//buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"TD"}, "#tw-weekly","%a");
//buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"ND"}, "#ntb-weekly","%a");

//buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"TD"}, "#tw-monthly","%a");
//buildBarChart({rawData:"data/daily_report.json",key1:"4",key2:"ND"}, "#ntb-monthly","%a");