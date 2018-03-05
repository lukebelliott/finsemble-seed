//host config - to move elsewhere
var yellowfinProtocol = "http://";
var yellowfinHost = "localhost";
var yellowfinPort = "8081";
var yellowfinPath = "/JsAPI"
var yellowfinReportPath = "/JsAPI?api=reports"

//JQuery
var $ = require("jquery");

//state
var filtersSelected = {};
var filterArr = [];
var reportUUID = null;

function setFilters() {
	$("filtervalue").removeClass("selected");
	for (let filter of filterArr) {
		if (filter.list && filter.listValues){
			if (filtersSelected[filter.filterUUID]) {
				var filterBlock = $('filter filterUUID:contains(' + filter.filterUUID + ')').parent();
				console.log("filter: " + filterBlock.find('filterUUID').text());
				filterBlock.find('values filtervalue').each(function () {
					console.log("value: " + $( this ).find('label description').text());
					if (filtersSelected[filter.filterUUID].includes($( this ).find('label description').text())) {
						$( this ).addClass("selected");
					}
				});
			}		
		} else if (filter.list) {

		} else if (filter.between){

		}
	}
	FSBL.Clients.RouterClient.transmit(FSBL.Clients.WindowClient.options.name, filtersSelected);
	setState();
}

function clickFilter(event) {
	console.log("clickFilter: " + JSON.stringify(event.data));
	var data = event.data;
	if (!filtersSelected[data[0]]) {
		filtersSelected[data[0]] = [data[1].value];
	} else if (filtersSelected[data[0]].includes(data[1].value)){
		filtersSelected[data[0]].splice(filtersSelected[data[0]].indexOf(data[1].value),1);
	} else {
		filtersSelected[data[0]].push(data[1].value);
	}

	console.log("filters selected: " + JSON.stringify(filtersSelected));
	//highlight selected filters
	setFilters();

	//publish selected filters
	
}


function renderPage() {
	var filter_template = $("template")[0];
	var value_template = $("template")[1];
	var between_template = $("template")[2];
	var freetext_template = $("template")[3];
	$("#filters").empty();
	for (let filter of filterArr) {
		console.log("filter row: " + JSON.stringify(filter));
		var filt_row = $(document.importNode(filter_template.content, true));
		filt_row.find("description").text(filter.description);
		filt_row.find("filterUUID").text(filter.filterUUID);

		var vals = filt_row.find("values");
		if (filter.list && filter.listValues){
			for (let value of filter.listValues) {
				var val_row = $(document.importNode(value_template.content, true));
				val_row.find("description").text(value.value);
				val_row.find("description").parent().parent().click([filter.filterUUID, value], clickFilter);
				vals.append(val_row);
			}
		} else if (filter.list) {
			var freetext_row = $(document.importNode(freetext_template.content, true));
			vals.append(freetext_row);

		} else if (filter.between){
			var between_row = $(document.importNode(between_template.content, true));
			vals.append(between_row);

			//TODO: add an onchanged action
			//val_row.find("description").parent().click([filter.filterUUID, value], clickFilter);
		} else {
			vals.append("<div>Unkown filter type</div>");
		}
		$("#filters").append(filt_row);
	}

	console.log("filters selected after page render: " + JSON.stringify(filtersSelected));
}




/**
 * Sets the state of a component to the Workspace
 */
function setState() {

	var state = {"filtersSelected": filtersSelected,
				"filterArr": filterArr,
				"reportUUID": reportUUID};
	FSBL.Clients.WindowClient.setComponentState({ field: 'reportState', value: state });
}

/**
 * Gets the the stored state of a component
 */
function getState() {
	FSBL.Clients.WindowClient.getComponentState({
		field: 'reportState',
	}, function (err, state) {
		if (state === null) {
			return;
		}

		filtersSelected = state.filtersSelected;
		filterArr = state.filterArr;
		reportUUID = state.reportUUID;
	});
}

/**
 * Everything needs to happen after Finsemble is ready
 */
FSBL.addEventListener("onReady", function () {
	FSBL.Clients.WindowClient.setWindowTitle("Report Filters");
	getState(); 

	//get spawing data to set report ID
	var spawnData = FSBL.Clients.WindowClient.getSpawnData();
	console.log("Spawn data: " + JSON.stringify(spawnData));
	if (spawnData){
		if (spawnData.reportUUID) { 
			reportUUID = spawnData.reportUUID;
			console.log("Set reportUUID: " + JSON.stringify(reportUUID)); 
		}
		if (spawnData.filtersSelected) { 
			filtersSelected = spawnData.filtersSelected; 
			console.log("Set filtersSelected: " + JSON.stringify(filtersSelected)); 
		}
	}

	//Listen to instructions from report panel
	var parent = FSBL.Clients.WindowClient.options.name.substring(0,FSBL.Clients.WindowClient.options.name.lastIndexOf("."));
	FSBL.Clients.RouterClient.addListener(parent, function (err, response) {
		if (err) return;
		filtersSelected = response.data;
		setFilters();
	});
	
	//load YellowFin API from host
	var yellowfinScr = document.createElement('script');
	yellowfinScr.setAttribute('src',yellowfinProtocol + yellowfinHost + ":" + yellowfinPort + yellowfinPath);
	yellowfinScr.setAttribute('type','text/javascript');

	var yellowfinReportScr = document.createElement('script');
	yellowfinReportScr.setAttribute('src',yellowfinProtocol + yellowfinHost + ":" + yellowfinPort + yellowfinReportPath);
	yellowfinReportScr.setAttribute('type','text/javascript');

	function filterCallback(filters) {
		console.log("Num filters: " + filters.length)
		filterArr = filters;
		// for (var i = 0; i < filterArr.length; i++) {
		// 	var filt = filterArr[i];
		// }
		renderPage();
		setFilters();
	 }

	//retrieve and inject report HTML when API loaded (wait on last script added to DOM)
	yellowfinReportScr.onload = function () {
		//load filters for a particular report
		window.yellowfin.reports.loadReportFilters(reportUUID, filterCallback);
	};

	document.body.appendChild(yellowfinScr);
	document.body.appendChild(yellowfinReportScr);
});