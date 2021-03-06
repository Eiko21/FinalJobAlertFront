if (localStorage.getItem("login")) {
  window.location.href = "/suscripciones/subs.html";
}
else {
  // Restear el número del contador de la extensión:
  chrome.browserAction.setBadgeText({text: ""});
}

async function login() {
  const data = {
    email: document.getElementById("email").value,
    password: sha256(document.getElementById("password").value)
    //password: document.getElementById("password").value
  }
  //console.log(data.password)
  axios.post('http://34.253.84.43:3030/api/sign', data)
    .then(function (response) {
      // handle success
      if (response.status === 200) {
        chrome.storage.local.set({ 'email': data.email, 'password': data.password, 'id': response.data.id }, function () {
          localStorage.setItem("login", JSON.stringify({ "email": data.email, "id": response.data.id }))
          window.location.href = "/suscripciones/subs.html";
        });
      }
    })
    .catch(function (error) {
      // handle error
      console.log("Login fallido:", error);
      if ($('.error').length == 0) {
        $(".login-form").append("<p class='error center-text'>Incorrect email or password</p>");
      }
    })
    .then(function () {
      // always executed
    });
}
$("#login").on("click", function () {
  login();
})

$('input').keyup(function(e){
  if(e.keyCode == 13)
  {
      login();
  }
});