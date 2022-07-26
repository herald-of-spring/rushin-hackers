var token;
var trackBuilder = "https://open.spotify.com/embed/track/";

// generates token to authorize api calls with
function auth() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: "grant_type=client_credentials&client_id=fd89d8878ecd40e994bb1c6ea0a9bde8&client_secret=b6e9d5d7b5914487a9b5598c0bb40354",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  .then(function (response) {
    console.log(response.status);
    return response.json();
  })
  .then(function (data) {
    token = data.access_token;
  })
}

auth();

// uses spotify's search api and generated token to populate the large and small iframes
document.getElementById("search-bar").addEventListener("click", function(event) {
  event.preventDefault();
  console.log(token);
  fetch("https://api.spotify.com/v1/search?q=" + document.getElementById("search-content").value + "&type=track", {
  headers: {
    "Authorization": "Bearer " + token
  }
  })
  .then(function (response) {
    if (response.status == 200) {
      return response.json();
    }
  })
  .then(function (data) {
    if (data != undefined) {
      for (El of document.getElementsByClassName("iframe")) {
        El.setAttribute("src", trackBuilder + data.tracks.items[0].id);
      }
    }
  })
})