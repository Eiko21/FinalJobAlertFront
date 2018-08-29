//import hash from 'hash.js'
if(localStorage.getItem("login")){
  window.location.href = "/suscripciones/subs.html";
}

async function login(){
  const data = {
    email: document.getElementById("email").value,
    //password: hash.sha256().update(document.getElementById("password").value).digest('hex')
    password: document.getElementById("password").value
  }
  axios.post('http://localhost:3333/api/sign', data)
  .then(function(response) {
    // handle success
    if(response.status === 200){
      chrome.storage.local.set({'email': data.email, 'password': data.password, 'id': response.data._id}, function() {
        localStorage.setItem("login", data.email)
        console.log(localStorage.getItem(data.password, data.email))
        window.location.href = "/suscripciones/subs.html";
      });
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
$("#login").on("click", function(){
  login();
})