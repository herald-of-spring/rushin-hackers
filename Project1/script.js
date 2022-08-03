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
    if (searchFormat === "genre") {
        apiUrl = "https://api.spotify.com/v1/search?q=genre:" + searchEl.value;//apiurl = fetch for spotify by genre using genreEl.value goes here
    }
    if (searchFormat === "band") {
        //runs search for genres linked to searchEl.value and apiurl = fetches from spotify with that genre
    }
    console.log(apiUrl);
    fetch(apiUrl + "&type=track", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            displayResults(data.tracks.items);
            //This is the function to generate the list from the data fetched.
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
    

//formatEl.addEventListener("click", vischeck);
btn.addEventListener("click", runSearch);
var displayResults = function(results) {
    for (i = 0; i< 5; i++) {
        var bandName = results[i].artists[0].name;
        var listEntry = document.createElement('div');
        var titleEl = document.createElement("span");
        titleEl.textContent = bandName;
        listEntry.appendChild(titleEl);
        //var purchase = generate link to ticketmaster with search for band
        //var purchaseEl = document.createElement('button');
        //purchaseEl.textContent = "Buy tickets here!";
        //purchaseEl.setAttribute("href", purchase);
        //listEntry.appendChild(purchaseEl);
        var songEl = document.createElement('iframe'); //will be Andy's iframe player, probably the small one of the two. Would populate with the search text being bandname.
        songEl.width = "300";
        songEl.height = "80";
        songEl.loading = "lazy";
        songEl.class = "iframe";
        songEl.style.border = "no";
        fetch("https://api.spotify.com/v1/search?q=" + bandName + "&type=track", {
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
                songEl.setAttribute("src", "https://open.spotify.com/embed/track/" + data.tracks.items[0].id);
            }
        })
        listEntry.appendChild(songEl);
        listEl.appendChild(listEntry);
    }
}
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
