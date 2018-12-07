const Finsemble = require("@chartiq/finsemble");
const RouterClient = Finsemble.Clients.RouterClient;
const Logger = Finsemble.Clients.Logger;
Logger.start();
Logger.log("alertmanager Service starting up");

// Add and initialize any other clients you need to use 
//   (services are initialised by the system, clients are not)
let WindowClient = Finsemble.Clients.WindowClient;
WindowClient.initialize();
let LauncherClient = Finsemble.Clients.WindowClient;
LauncherClient.initialize();
let DistributedStoreClient = Finsemble.Clients.DistributedStoreClient;
DistributedStoreClient.initialize();

//TODO: Remove me, used to mock remotely triggered alert
const HotkeyClient = Finsemble.Clients.HotkeyClient
HotkeyClient.initialize();
const keyMap = FSBL.Clients.HotkeyClient.keyMap,
hotkeys = [keyMap.ctrl, keyMap.shift, keyMap.m];
let idCounter = 0;

/**
 * 
 * @constructor
 */
function alertmanagerService() {
	const self = this;
	let storeObject = null;

	//Implement service functionality
	/**
	 * 
	 */
	this.init = function(cb) {
		//(Optional) set up a Distributed store to drive the AlertPopup component
		DistributedStoreClient.createStore({
			store:"AlertStore",
			global:true,
			values:{ alerts: [], numAlerts: 0 }
		}, function(err,storeObject_) {
			if (err) {
				Logger.error("AlertStore Distributed Sotre setup failed");
			}
			storeObject = storeObject_;
			cb();
		});
	}
	
	/**
	 * 
	 */
	this.receiveAlert = function (alertData, cb) {
		if (!alertData.id) {
			Logger.error("Alert added with no 'id' field. It will not be retrievable.", err);
		}
		alertData.receivedTimestamp = Date.now();
		//add the alert to the store 
		storeObject.getValue({field:'alerts'},function(err,alerts){
			alertData.receivedTimestamp = Date.now();
			alerts.push(alertData);
			storeObject.setValues([{field:'alerts', value: alerts}, {field:'numAlerts', value: alerts.length}], 
			function(err) {
				if (err) { 
					Logger.error("AlertStore Distributed Store failed to save alerts array", err); 
					cb(err, { status: "error" });
				}
				else {
					cb(null, { status: "received" });
				}
			});
		});

		//show the alert component window with showWindow 
		let windowIdentifier = {componentType: "alertPopup", windowName: "alertPopup"};
		FSBL.Clients.LauncherClient.showWindow(windowIdentifier, {
			spawnIfNotFound: true,
			top: "center",
			left: "center",
			width: 800,
			height: 600
		});

		//(Optional) if not using the Distributed store to drive the AlertPopup component, then transmit something on the router to update the UI
		//  RouterClient.transmit("Alert", alertData);

	}

	/**
	 * 
	 */
	this.dismissAlert = function (alert, cb) {
		if (!alert) { 
			Logger.error("no alert passed to dismiss!"); 
			if (cb) { cb("no alert passed to dismiss!");}
		} else {
			//remove the alert from store
			storeObject.getValue({field:'alerts'},function(err, alerts){
				if(err) {
					Logger.error("AlertStore Distributed Store failed to retrieve alerts array", err);
				} else {
					let theAlert = null;
					for (let a = 0; a < alerts.length; a++) {
						if (a.id === alert.id) {
							theAlert = alerts.splice(a,1);
							break;
						}
					}
					if (theAlert) {
						//save updated alerts to store
						storeObject.setValues([{field:'alerts', value: alerts}, {field:'numAlerts', value: alerts.length}], 
						function(err) {
							if (err) { 
								Logger.error("AlertStore Distributed Store failed to save alerts array", err); 
								if (cb) { cb(err, { alert: theAlert, status: "error" }); }
							} else {
								if (cb) { cb(err, { alert: theAlert, status: "dismissed" }); }
							}
							
						});

						//(Optional) if not using the Distributed store to drive the AlertPopup component, or another component 
						//  that is involved, send a router transmission to update it, e.g.
						//  RouterClient.transmit("Alert dismissed", theAlert);

					} else {
						//log the fact that we didn't find the alert
						let msg = `Alert id: ${alert.id} not found`;
						Logger.error(msg);
						if (cb) { cb(msg, { alert: alert, status: "not found" }); }
					}
				}
			});
		}
	}

	/**
	 * 
	 */
	this.respondToAlert = function (alert, response, cb) {
		if (!response){ 
			Logger.error("response to alert was undefined!"); 
			if (cb) { cb ("response to alert was undefined!", { alert: alert, status: "error" }); }
		} else {
			//dismiss the alert as we're about to respond to it
			this.dismissAlert(alert, function(err, res) {
				if(!err) { 
					res.status = "responded"; 
					//TODO: send the 'response' and any required info from the the 'alert' to the remote service
				


				} 
				if (cb) { cb (err, res); }
		});
	}


	/**
	 * 
	 */
	this.setupConnections = function () {
		//TODO: Setup a websocket connection or long polling etc. to check for new alerts, set it up here
		//mocked with a hot key (Ctrl + Shift + M)
		HotkeyClient.addGlobalHotkey(hotkeys, 
			function(err,response) { // On triggered
				if(err){
					return console.error(err);
				}
				self.receiveAlert({id: idCounter++, msg: "Dummy alert " + idCounter, triggered: "via a hotkey"});
			}, 
			function(err) {  //On registered
				if(err){
					return console.error(err);
				}
			});

		this.createRouterEndpoints();
	}

	/**
	 * Creates a router endpoint for you service. 
	 * Add query responders, listeners or pub/sub topic as appropriate. 
	 * @private
	 */
	this.createRouterEndpoints = function () {
		//Example router integration which uses a single query responder to expose multiple functions
		RouterClient.addResponder("alertmanager functions", function(error, queryMessage) {
			if (!error) {
				Logger.log('alertmanager Query: ',queryMessage);
				
				//For sending a response to an alert
				if (queryMessage.data.query === "respondToAlert") {
					try {
						self.respondToAlert(queryMessage.data.alert, queryMessage.data.response, queryMessage.sendQueryResponse);
					} catch (err) { queryMessage.sendQueryResponse(err); }

					//for dismissing an alert without sending a response
				} else if (queryMessage.data.query === "dismissAlert") {
					try {
						self.dismissAlert(queryMessage.data.alert, queryMessage.sendQueryResponse);
					} catch (err) { queryMessage.sendQueryResponse(err); }

					//to receive a locally generated alert
				} else if (queryMessage.data.query === "receiveAlert") {
					try {
						self.receiveAlert(queryMessage.data.alert, queryMessage.sendQueryResponse);
					} catch (err) { queryMessage.sendQueryResponse(err); }

					//Add other query functions here
				} else {
					queryMessage.sendQueryResponse("Unknown alertmanager query function: " + queryMessage, null);
					Logger.error("Unknown alertmanager query function: ", queryMessage);
				}
			} else {
				Logger.error("Failed to setup alertmanager query responder", error);
			}
		});	
	};

	return this;
};

alertmanagerService.prototype = new Finsemble.baseService({
	startupDependencies: {
		// add any services or clients that should be started before your service
		services: [/* "dockingService", "authenticationService" */],
		clients: ["windowClient", "launcherClient", "distributedStoreClient"]
	}
});
const serviceInstance = new alertmanagerService('alertmanagerService');

serviceInstance.onBaseServiceReady(function (callback) {
	serviceInstance.init(serviceInstance.setupConnections);
	Logger.log("alertmanager Service ready");
	callback();
});

serviceInstance.start();
module.exports = serviceInstance;