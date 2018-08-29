'use strict';

let number = 0;
let domain = null;

function track() {
	let result, match;
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		const url = tabs[0].url;
		if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
			result = match[1]
			if (result === "jobs.lever.co" || result === "boards.greenhouse.io") {
				result = url.match(/\/([^/]*)$/)[1];
			} else {
				if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
					result = match[1]
				}
				let filter = (/\b.*(?=(\.))/);
				result = filter.exec(result);
			}
		}

		domain = result;


		if (domain && typeof (domain) === "object") {
			domain = domain[0];
		}

		//chrome.browserAction.setBadgeText({text: number.toString()});
		number += 1;


		if (domain) {
			axios({
				method: 'post',
				url: 'http://34.253.84.43:3030/api/subscriptions/checksubscribe',
				data: {
					subscription: domain,
				}
			}).then(function (response) {
				if (response.status == 200) {
					chrome.browserAction.setIcon({ path: "./images/color.png" });
				}
				else {
					chrome.browserAction.setIcon({ path: "./images/color-red.png" });
				}

			}).catch(function (err) {
				console.log(err);
			})
		}


	});
	return;
}



document.addEventListener('DOMContentLoaded', function () {
});

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		if (changeInfo.status === "complete") {
			chrome.browserAction.setIcon({ path: "./images/get_started16.png" });

			if (localStorage.getItem("login")) { // Si la sesion esta iniciada
				track();
			}
			else {
				chrome.browserAction.setIcon({ path: "./images/disabled.png" });
			}
		}
	});

chrome.tabs.onActivated.addListener(
	function (info) {
		chrome.browserAction.setIcon({ path: "./images/get_started16.png" });

		if (localStorage.getItem("login")) { // Si la sesion esta iniciada
			track();
		}
		else {
			chrome.browserAction.setIcon({ path: "./images/disabled.png" });
		}
	});