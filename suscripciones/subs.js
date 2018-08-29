$(function(){
  console.log("Start");
  $("#track").click(track)
})
  
async function track() {
  let result, match;
  let data = {
    email: "",
    subscription: ""
  };
  await chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      const url = tabs[0].url;
      if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if(result === "jobs.lever.co" || result === "boards.greenhouse.io"){
          //let filter = (/\b.*(?=(\.))/);
          result = url.match(/\/([^/]*)$/)[1];
          console.log(result)
        }else{
          if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
          }
          let filter = (/\b.*(?=(\.))/);
          result = filter.exec(result);
          console.log(result)
        }
      }
    data.subscription = result[0];
    chrome.storage.local.get(['email'], function(result){
      data.email= result.email;
      subscribe(data)
    })
  });
}

async function subscribe(data){
  axios.post('http://localhost:3333/api/subscriptions/subscribe', data)
  .then(function (response) {
    // handle success
    if(response.status === 200){
      return true;
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

async function getSubscriptions(){
  axios.get('http://localhost:3333/api/subscriptions/:id')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}
$("#but").on("click", function(){
  track();
})

document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicio');
});

chrome.tabs.onUpdated.addListener(
  function ( tabId, changeInfo, tab ){ 
    if ( changeInfo.status === "complete" ){
      chrome.tabs.executeScript({ code: "console.log('attempt #4');" }, function() {
        console.log("Pag cambiada, AQUI HACER LA PETICION DE CHECKSUBSCRIBE");
      // If checksubscribe da positivo:
      // chrome.browserAction.setIcon({path: "./images/color.png"});
      // Si no:
      // chrome.browserAction.setIcon({path: "./images/normal.png"});
      
      // Para mostrar el número de notificaciones:
      // chrome.browserAction.setBadgeText({text: number.toString()});
      });
    }
});