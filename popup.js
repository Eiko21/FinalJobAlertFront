$( document ).ready(function() {
  chrome.storage.local.get(['email','password','id'], function(result){
      axios.post('http://localhost:3333/api/subscriptions/subscribe', data)
        .then(function (response) {
          // handle success
          if(response.status === 200){
            chrome.storage.local.set({'email': data.email, 'password': data.password, 'id': response.data._id}, function() {
              window.location.href = "/suscripciones/subs.html";
            });
          }
          fetch('http://localhost:3333/api/subscriptions/subscribe', {
            method: 'post',
            body: JSON.stringify(result)
          }).then(function(response){return response.json();})
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
  });
});

$(function(){
  console.log("Start");
  $("#track").click(track)
})

function track() {
  console.log("Clicked");
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    const fullUrl = tabs[0].url;
    const converted = new URL(fullUrl);
    
    let filters = [ /\b.*(?=(\.))/];

    let domain = null;
    // Cortar hasta los posibles filtros (.com, .es, etc)
    for (let i = 0; i <= filters.length; i += 1) {
      if (!domain) {
        domain = filters[i].exec(converted.hostname);
      }
    }
    //console.log("Antes de filtrar www:", domain[0]);

    // Eliminar el "www"
    if (domain[0]) {
      let wwwFilter = /(?<=www\.).*$/
      if (wwwFilter.exec(domain[0])) {
        domain = wwwFilter.exec(domain[0]);
      }
    }
    
    console.log(domain[0]);
    $.get( `https://boards-api.greenhouse.io/v1/boards/${domain[0]}/jobs`, function( data ) {
      console.log(data);
    });
  });
}