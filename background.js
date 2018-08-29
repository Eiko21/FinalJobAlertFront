'use strict';
/*
chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ color: '#3aa757' }, function () {
		console.log("The color is green.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				//pageUrl: {hostEquals: 'developer.chrome.com'},
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});
*/



let number = 0;
let domain = null;

function track() {
	let result, match;
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		const url = tabs[0].url;
		if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
		  result = match[1]
		  if(result === "jobs.lever.co" || result === "boards.greenhouse.io"){
			result = url.match(/\/([^/]*)$/)[1];
			console.log("Es una API", result)
		  }else{
			if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
			  result = match[1]
			}
			let filter = (/\b.*(?=(\.))/);
			result = filter.exec(result);
			//console.log(result)
		  }
		}

		domain = result;








		if (domain && typeof(domain) === "object") {
			console.log("Domain es object")
			domain = domain[0];
		}

		//console.log("Track Domain:", domain);
    /*$.get( `https://boards-api.greenhouse.io/v1/boards/${domain}/jobs`, function( data ) {
      console.log(data);
    });*/

		//chrome.browserAction.setBadgeText({text: number.toString()});
		number += 1;
		//console.log(number);
		






		//console.log("Sending message pre");
			//chrome.runtime.sendMessage({ func: "track" }, function (response) {
			//	console.log("Sending message");
			//});


			console.log("Pag cambiada, AQUI HACER LA PETICION DE CHECKSUBSCRIBE");
			console.log("El dominio es:", domain);


			if (domain) {
				axios({
					method: 'post',
					url: 'http://localhost:3333/api/subscriptions/checksubscribe',
					data: {
						subscription: domain,
					}
				  }).then(function (response) {
					// handle success
	
	
					// If checksubscribe da positivo:
					// chrome.browserAction.setIcon({path: "./images/color.png"});
					// Si no:
					// chrome.browserAction.setIcon({path: "./images/normal.png"});
					console.log("DOMAIN:", domain);
					if (response.status == 200) {
						console.log("Si se puede suscribir a", domain);
						chrome.browserAction.setIcon({ path: "./images/color.png" });
					}
					else {
						console.log("No se puede suscribir a", domain);
						chrome.browserAction.setIcon({ path: "./images/color-red.png" });
					}
	
					// Para mostrar el número de notificaciones:
					//chrome.browserAction.setBadgeText({ text: number.toString() });
	
					//console.log("Trigger updated");
	
					
				  }).catch(function (err){
					  console.log(err);
				  })
			}
			

	});
	return;
}





document.addEventListener('DOMContentLoaded', function () {
	console.log('Inicio');
});

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		if (changeInfo.status === "complete") {
			console.log("onUpdated");
			chrome.browserAction.setIcon({ path: "./images/get_started16.png" });

			if(localStorage.getItem("login")){ // Si la sesion esta iniciada
				track();
			}
		}
	});

/*chrome.tabs.onActivated.addListener(
	function (tabId, changeInfo, tab) {*/
chrome.tabs.onActivated.addListener( function(info) {
			console.log("onActivated");
			chrome.browserAction.setIcon({ path: "./images/get_started16.png" });

			if(localStorage.getItem("login")){ // Si la sesion esta iniciada
				track();
			}


			/*
			//console.log("Sending message pre");
			//chrome.runtime.sendMessage({ func: "track" }, function (response) {
			//	console.log("Sending message");
			//});


			console.log("Tab cambiada");
			// If checksubscribe da positivo:
			// chrome.browserAction.setIcon({path: "./images/color.png"});
			// Si no:
			// chrome.browserAction.setIcon({path: "./images/normal.png"});
			console.log("DOMAIN:", domain);
			if (domain && domain == "jobs.lever") {
				console.log("Lever");
				chrome.browserAction.setIcon({ path: "./images/color.png" });
			}
			else {
				console.log("No Lever");
				chrome.browserAction.setIcon({ path: "./images/get_started16.png" });
			}

			// Para mostrar el número de notificaciones:
			chrome.browserAction.setBadgeText({ text: number.toString() });
			console.log("Trigger changed");
			*/
	});







