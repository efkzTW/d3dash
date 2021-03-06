
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

	console.log(jsonURL);

	totalSubs(jsonURL,lastDate);
	
	buildBullet({rawData: jsonURL, key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#d-bul-combo", "daily");
	buildBullet({rawData: jsonURL, key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#d-bul-taiex", "daily");

	buildBullet({rawData: jsonURL, key1: "5", key2: "Combo", key3: "DN", key4: "DR"}, "#w-bul-combo", "weekly");
	buildBullet({rawData: jsonURL, key1: "5", key2: "TaiEx", key3: "DN", key4: "DR"}, "#w-bul-taiex", "weekly");

	buildBullet({rawData:jsonURL, key1: "5", key2: "Combo", key3: "MN", key4: "MR"}, "#m-bul-combo", "monthly");
	buildBullet({rawData:jsonURL, key1: "5", key2: "TaiEx", key3: "MN", key4: "MR"}, "#m-bul-taiex", "monthly");

	buildBarChart({rawData:jsonURL,key1:"4",key2:"TD"}, "#tw-daily","%a","daily");
	buildBarChart({rawData:jsonURL,key1:"4",key2:"ND"}, "#ntb-daily","%a","daily");

	buildBarChart({rawData:jsonURL,key1:"4",key2:"TD"}, "#tw-weekly","%m/%d","weekly");
	buildBarChart({rawData:jsonURL,key1:"4",key2:"ND"}, "#ntb-weekly","%m/%d","weekly");

	buildBarChart({rawData:jsonURL,key1:"4",key2:"TM"}, "#tw-monthly","%b","monthly");
	buildBarChart({rawData:jsonURL,key1:"4",key2:"NM"}, "#ntb-monthly","%b","monthly");

	buildLineGraph({rawData:[jsonURL],key1:"6",key2:["Combo", "TaiEx", "Deluxe"],key3:"Daily"},"#trend-7_total","7days")
	buildLineGraph({rawData:[jsonURL],key1:"6",key2:["Combo", "TaiEx", "Deluxe"],key3:"Daily"},"#trend-14_total","14days")
	buildLineGraph({rawData:[jsonURL],key1:"6",key2:["Combo", "TaiEx", "Deluxe"],key3:"Daily"},"#trend-21_total","21days")

	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"TaiEx",key3:["DN", "DR"]},"#trend-7_new","7days")
	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"TaiEx",key3:["DN", "DR"]},"#trend-14_new","14days")
	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"TaiEx",key3:["DN", "DR"]},"#trend-21_new","21days")

	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"Combo",key3:["DN", "DR"]},"#trend-7_renew","7days")
	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"Combo",key3:["DN", "DR"]},"#trend-14_renew","14days")
	buildLineGraph_NR({rawData:[jsonURL],key1:"5",key2:"Combo",key3:["DN", "DR"]},"#trend-21_renew","21days")
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
