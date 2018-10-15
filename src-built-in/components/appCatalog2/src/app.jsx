/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/
/**
 * This component is the name of a component and a pin that will pin that component to all toolbars.
 *
 */
import React from "react";
import ReactDOM from 'react-dom';
import * as storeExports from "./stores/appCatalogStore";

//components
import Home from './components/Home';

//style
import '../appCatalog2.css';

export default class AppCatalog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			actualCards: [
				{
					"name": "Welcome Component",
					"type": "component",
					"description": "This is the component that welcomes you to finsemble. It also links you to the documentation. This documentation is really well written and is worth reading!!!!",
					"appId": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifest": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifestType": "This is part of the FDC3 standard but we don't know what this value will be.",
					"version": "3.0.1",
					"releaseNotes": "This version is so much more welcoming. You have no idea. I wonder what happens when I put a link in the release notes. https://documentation.chartiq.com/finsemble/changelog.html",
					"tooltip": "Welcome component",
					"images": [
						{
							"id": "4",
							"url": "http://sugardale.com/sites/default/files/stuffed%20crust%20pizza.jpg",
							"tooltip": "Pizza!!!"
						}
					],
					"tags": [
						"newrelease",
						"Pizza"
					],
					"contactEmail": "jim@chartiq.com",
					"supportEmail": "dnicolai@chartiq.com",
					"publisher": "ChartIQ",
					"icons": [
						{
							"id": "2321",
							"url": "https://previews.123rf.com/images/maxborovkov/maxborovkov1507/maxborovkov150700243/42795794-white-welcome-sign-over-confetti-background-vector-holiday-illustration-.jpg",
							"type": "primary"
						}
					],
					"friendlyName": "The Welcome Component"
				},
				{
					"name": "Notepad",
					"entitled": true,
					"type": "component",
					"description": "The notepad that you know and hate, but in FINSEMBLE! It comes with a mandatory little window that follows it around nicely or very slowly, depending on which branch you're working on.",
					"appId": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifest": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifestType": "This is part of the FDC3 standard but we don't know what this value will be.",
					"version": "12",
					"releaseNotes": "Check out the companion window. It's real sweet now. Going to try to put HTML in here <a href=\"https://documentation.chartiq.com/finsemble/changelog.html\">CHANGELOG!!</a>",
					"title": "Notepad",
					"tooltip": "Notepad",
					"images": [
						{
							"id": 1,
							"url": "https://m.riflepaperco.com/media/catalog/product/cache/1/thumbnail/1170x1248/fb193eecb19491ee2d70d1d38e002e96/n/p/npm017-rose-lines-01.jpg",
							"tooltip": "Notepad"
						},
						{
							"id": "2",
							"url": "https://www.howtogeek.com/wp-content/uploads/2018/07/img_5b48157fc1e63.png",
							"tooltip": "Notepad"
						},
						{
							"id": "3",
							"url": "https://cdn2.bigcommerce.com/n-zfvgw8/a8bv6/products/418/images/627/Notepad_Pen__81380.1416860234.375.513.jpg?c=2",
							"tooltip": "Notepad"
						}
					],
					"tags": [
						"Notepad",
						"productivity"
					],
					"contactEmail": "jim@chartiq.com",
					"supportEmail": "dnicolai@chartiq.com",
					"publisher": "ChartIQ",
					"icons": [
						{
							"id": 3811341,
							"url": "https://is5-ssl.mzstatic.com/image/thumb/Purple128/v4/4c/f5/97/4cf597ef-aa83-01f6-0aaf-c6a61a5e686b/AppIcon-1x_U007emarketing-85-220-3.png/246x0w.jpg",
							"type": "primary"
						}
					],
					"friendlyName": "Notepad"
				},
				{
					"name": "Process Monitor",
					"type": "component",
					"description": "WOW. What a treat. This component shows you how much memory your components are eating up. Like hungry hungry hippos, they will eat until their stomachs explode! Make sure to keep tabs on them with this component.",
					"appId": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifest": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifestType": "This is part of the FDC3 standard but we don't know what this value will be.",
					"title": "Process Monitor",
					"tooltip": "Process Monitor",
					"images": [
						{
							"id": 3411,
							"url": "https://www.dextronix.com/wp-content/uploads/2014/06/Mon-6-Recorder.png",
							"tooltip": "graphs"
						},
						{
							"id": 3511,
							"url": "http://www3.gehealthcare.sa/~/media/images/product/product-categories/patient-monitoring/uk-site-images/wireless/apexpro-t4-telemetry-system/uk_apexpro-t4_spotlight.jpg?w=646",
							"tooltip": "Equipment"
						},
						{
							"id": 3611,
							"url": "http://www.tenforums.com/attachments/general-support/90601d1468783724t-moving-deleting-takes-long-dialog-shows-99-couple-seconds-memory-spike.png",
							"tooltip": "Code red!!!"
						},
						{
							"id": 3711,
							"url": "https://cdn3.vectorstock.com/i/1000x1000/73/57/sad-emoticon-vector-417357.jpg",
							"tooltip": "Sad"
						}
					],
					"tags": [
						"Success",
						"Memory",
						"Sad"
					],
					"contactEmail": "jim@chartiq.com",
					"supportEmail": "dnicolai@chartiq.com",
					"publisher": "ChartIQ",
					"icons": [
						{
							"id": 3811,
							"url": "http://www.nautilus-cap.com/Public/wp-content/uploads/2015/04/charts.png",
							"type": "primary"
						}
					],
					"friendlyName": "Process Monitor"
				},
				{
					"name": "DBOD",
					"type": "dashboard",
					"contents": [
						{
							"component": "Notepad"
						},
						{
							"component": "Welcome Component"
						},
						{
							"component": "Welcome Component"
						},
						{
							"component": "Welcome Component"
						},
						{
							"component": "Process Monitor"
						}
					],
					"description": "If I could figure out how to spec out a stacked window, this would be the group of components that most quickly hoses any new feature in finsemble. But I can't, so this will have to do.",
					"appId": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifest": "This is part of the FDC3 standard but we don't know what this value will be.",
					"manifestType": "This is part of the FDC3 standard but we don't know what this value will be.",
					"version": "6.0.0 (BETA)",
					"releaseNotes": "It's really hard to describe everything that's gone into this release of this dashboard. JK we haven't done much. Things work a little better. For the most part.",
					"title": "DBOD",
					"tooltip": "Dashboard of death",
					"images": [
						{
							"id": 2411,
							"url": "https://cdn.britannica.com/s:300x500/73/191073-131-0D844C57.jpg",
							"tooltip": "The reaper cometh"
						},
						{
							"id": 2511,
							"url": "https://images-na.ssl-images-amazon.com/images/I/41lbDOjGc7L._SX466_.jpg",
							"tooltip": "Caution"
						},
						{
							"id": 2611,
							"url": "https://5.imimg.com/data5/DD/ER/MY-12082150/danger-direction-signage-500x500.jpg",
							"tooltip": "Danger"
						},
						{
							"id": 2711,
							"url": "https://www.funeralbasics.org/wp-content/uploads/2017/04/coffin-pic.jpg",
							"tooltip": "Bork bork bork"
						}
					],
					"tags": [
						"death",
						"Pizza"
					],
					"contactEmail": "jim@chartiq.com",
					"supportEmail": "dnicolai@chartiq.com",
					"publisher": "ChartIQ",
					"icons": [
						{
							"id": 2811,
							"url": "https://temporarytattoos.com/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/s/k/skull-and-crossbones-temporary-tattoos_1601.jpg",
							"type": "primary"
						}
					],
					"friendlyName": "Dashboard of death"
				}
			],
			activePage: "home"
		};
		this.bindCorrectContext();
	}
	bindCorrectContext() {
		this.navigateToShowcase = this.navigateToShowcase.bind(this);
	}
	navigateToShowcase() {

	}
	render() {

		if (this.state.activePage === "home") {
			return (
				<Home cards={this.state.actualCards} />
			);
		} else {
			return (
				<div></div>
			);
		}
	}
}

FSBL.addEventListener("onReady", function () {

	storeExports.Actions.initialize(function (store) {
		ReactDOM.render(
			<AppCatalog />
			, document.getElementById("bodyHere"));
	});
});