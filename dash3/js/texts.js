
//default date settings for datePicker
(function(){
	var today = new Date();
	var yesterday = new Date();
	yesterday.setDate(today.getDate()-1);

	//use date picker for future version
	//allow user to select past report date
	//$("#datePicker").val(yesterday.toJSON().slice(0,10))
	//				.attr("max",today.toJSON().slice(0,10));

	var txtYes = yesterday.getFullYear() + "/" + (yesterday.getMonth()+1) + "/" + yesterday.getDate();

	document.getElementById("yesterday-report").appendChild(document.createTextNode(txtYes));

	var jsonBaseURL = "http://crm.dishhdasia.com/ccb/daily_report_json.php?d=";
	var lastDate = yesterday.toJSON().slice(0,10);
	var jsonURL = jsonBaseURL + lastDate;

	totalSubs(jsonURL,lastDate);
	
	buildBullet({rawData: jsonURL, key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#d-bul-combo", "daily");
	buildBullet({rawData: jsonURL, key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#d-bul-taiex", "daily");

	buildBullet({rawData: jsonURL, key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#w-bul-combo", "weekly");
	buildBullet({rawData: jsonURL, key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#w-bul-taiex", "weekly");

	buildBullet({rawData:jsonURL, key1: "5", key2: "Combo", key3: "MN", key4: "MR"}, "#m-bul-combo", "monthly");
	buildBullet({rawData:jsonURL, key1: "5", key2: "TaiEx", key3: "MN", key4: "MR"}, "#m-bul-taiex", "monthly");

	buildBarChart({rawData:jsonURL,key1:"4",key2:"TD"}, "#tw-daily","%a");
	buildBarChart({rawData:jsonURL,key1:"4",key2:"ND"}, "#ntb-daily","%a");

	buildLineGraph({rawData:jsonURL,key1:"5",key2:"Combo",key3:"DN",key4:"DR"},"#trend-7")
}());




function totalSubs(url, lastDate) {
$.getJSON(url, function(data) {

	var ntbTotal = data[lastDate]["1"]["NTB"]["Active"] + data[lastDate]["1"]["NTB"]["ActiveAddon"];
	var twTotal = data[lastDate]["1"]["TW"]["Active"];

	document.getElementById("tw-active").appendChild(document.createTextNode(twTotal));
	document.getElementById("ntb-active").appendChild(document.createTextNode(ntbTotal));

	//update
	//$("#tw-active").text(twTotal);
	//$("#ntb-active").text(ntbTotal);
});}
