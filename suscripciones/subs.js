$(function(){
  console.log("Start");
  $("#track").click(track)
})
  
async function track() {
  let data = {
    email: "",
    subscription: ""
  };
  await getCurrentDomain().then(function (result) {
    console.log("Result:", result);
    data.subscription = result;
    chrome.storage.local.get(['email'], function(result){
      data.email= result.email;
      subscribe(data)
    })
  })
}

async function getCurrentDomain() {

  let result;
  let match;

  return new Promise(function(resolve, reject) {
    
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const url = tabs[0].url;
      if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (result === "jobs.lever.co" || result === "boards.greenhouse.io") {
          //let filter = (/\b.*(?=(\.))/);
          result = url.match(/\/([^/]*)$/)[1];
          //console.log(result)
        } else {
          if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
          }
          let filter = (/\b.*(?=(\.))/);
          result = filter.exec(result);
          //console.log(result)
        }
      }
      if (result && typeof(result) === "object") {
        result = result[0];
      }
      resolve(result);


    })

  });

  /*
  //Promise.resolve(promise)
  promise.then(function () {
    console.log("La promesa devuelve", result);
  });
  */
  
}


//console.log("getCurrentDomain returns", result);
//return result;

async function subscribe(data){
  axios.post('http://34.253.84.43:3030/api/subscriptions/subscribe', data)
  .then(function (response) {
    // handle success
    if(response.status === 201){
      console.log("Suscrito correctamente");
      $("#but").html("Subscribed");
      $("#but").attr("disabled", true);
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

async function checkIsSuscribed() {
  getCurrentDomain().then(function (response) {
    console.log('checkIsSuscribed -> response', response);
    getSubscriptions(response);
  })
}
checkIsSuscribed();


async function checkCanSubscribe() {
  getCurrentDomain().then(function (response) {
    
    axios({
      method: 'post',
      url: 'http://34.253.84.43:3030/api/subscriptions/checksubscribe',
      data: {
        subscription: response,
      }
      }).then(function (response) {
      if (response.status == 200) {
        $("#but").html("Subscribe");
      }
      else {
        $("#but").html("Unavailable");
        $("#but").attr("disabled", true);
      }
      }).catch(function (err){
        console.log(err);
      })

  })
}
checkCanSubscribe();


//getSubscriptions(getCurrentDomain());
async function getSubscriptions(domain){
  const localData = JSON.parse(localStorage.getItem("login"))
  axios.get('http://34.253.84.43:3030/api/subscriptions/'+localData.id)
  .then(function (response) {
    // handle success
    //console.log(response);
    if (response.data.subscriptions.includes(domain)) {
      console.log("Ya estas suscrito a", domain)
      $("#but").html("Subscribed");
      $("#but").attr("disabled", true);
    }
    else {
      console.log("No te has suscrito a", domain)
    }
  })
  .catch(function (error) {
    // handle error
    console.log("Error en getSubs", error);
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