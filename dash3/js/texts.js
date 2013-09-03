$.getJSON("data/daily_report.json", function(data) {
	//console.log(data);
	//console.log(data["report_date"]);
	//update report date
	var lastDate = data["report_date"];
	$("#report-date").text("Report Date: " + lastDate);

	var ntbTotal = data[lastDate]["1"]["NTB"]["Active"] + data[lastDate]["1"]["NTB"]["ActiveAddon"];
	var twTotal = data[lastDate]["1"]["TW"]["Active"];
	//update
	$("#tw-active").text(twTotal);
	$("#ntb-active").text(ntbTotal);
});