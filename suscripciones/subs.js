$(function () {
  $("#track").click(track)
})

async function track() {
  let data = {
    id: "",
    email: "",
    subscription: ""
  };
  await getCurrentDomain().then(async function (result) {
    data.subscription = result;
    const localData = JSON.parse(localStorage.getItem("login"))
    data.id = localData.id;
    data.email = localData.email;
      subscribe(data)
    })
}

async function getCurrentDomain() {

  let result;
  let match;

  return new Promise(function (resolve, reject) {

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
      if (result && typeof (result) === "object") {
        result = result[0];
      }
      resolve(result);


    })

  });

}


async function subscribe(data) {
  axios.post('http://34.253.84.43:3030/api/subscriptions/subscribe', data)
    .then(function (response) {
      // handle success
      if (response.status === 201) {
        $("#but").html("Subscribed");
        $("#but").addClass("btn-disabled");
        $("#but").attr("disabled", true);
        return true;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}


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
        $("#but").removeClass("btn-disabled");
        $("#but").attr("disabled", false);
      }
      else {
        $("#but").html("Unavailable");
        $("#but").addClass("btn-disabled");
        $("#but").attr("disabled", true);
      }
      checkIsSuscribed();
    }).catch(function (err) {
      console.log(err);
    })

  })
}
checkCanSubscribe();


async function checkIsSuscribed() {
  getCurrentDomain().then(function (response) {
    getSubscriptions(response);
  })
}


//getSubscriptions(getCurrentDomain());
async function getSubscriptions(domain) {
  const localData = JSON.parse(localStorage.getItem("login"))
  axios.get('http://34.253.84.43:3030/api/subscriptions/' + localData.id)
    .then(function (response) {
      // handle success
      if (response.data.subscriptions.includes(domain)) {
        $("#but").html("Subscribed");
        $("#but").addClass("btn-disabled");
        $("#but").attr("disabled", true);
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

function checkAlert() {
	
	const userId = JSON.parse(localStorage.getItem("login")).id;
	axios({
		method: 'get',
		url: 'http://34.253.84.43:3030/api/jobs/'+userId
	}).then(function (response) {
		if (response.status == 200) {
			chrome.browserAction.setBadgeText({text: response.data.length.toString()});
		}
	}).catch(function (err) {
		console.log(err);
	})
	
}

checkAlert();

$("#but").on("click", function () {
  track();
})

document.addEventListener('DOMContentLoaded', function () {
});