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
      console.log("RESPONSE:", response.data);
      chrome.storage.local.set({'email': data.email, 'password': data.password, 'id': response.data.id}, function() {
        localStorage.setItem("login", JSON.stringify({"email": data.email, "id": response.data.id}))
        window.location.href = "/suscripciones/subs.html";
      });
    }
  })
  .catch(function (error) {
    // handle error
    console.log("Login fallido:", error);
    console.log($('.error').length);
    if ($('.error').length == 0) {
      $( ".login-form" ).append( "<p class='error'>Incorrect email or password</p>" );
    }
  })
  .then(function () {
    // always executed
  });
}
$("#login").on("click", function(){
  login();
})