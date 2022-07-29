var token;
formatEl=document.querySelector("#formatInput");
searchEl=document.querySelector("#searchInput");
genreEl=document.querySelector("#genre");
btn=document.querySelector("button");
listEl=document.querySelector("#toAppend");
//auth function is all Andy's
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
function vischeck() {
    searchValue=formatEl.value;
    if (searchValue === "genre") {
        genreEl.style.visibility="visible";
        searchEl.style.visibility="hidden";
    }
    else {
        genreEl.style.visibility="hidden";
        searchEl.style.visibility="visible";
    }
}
function runSearch() {
    event.preventDefault();
    var apiUrl;
    searchFormat=formatEl.value;
    if (searchFormat === "location") {
        //apiurl = fetch for ticketmaster shows by location goes here for searchEl.value
    }
    if (searchFormat === "genre") {
        apiUrl = "https://api.spotify.com/v1/search?q=genre:" + searchEl.value;//apiurl = fetch for spotify by genre using genreEl.value goes here
    }
    if (searchFormat === "band") {
        fetch("https://api.spotify.com/v1/search?q=artist:" + searchEl.value + "&type=artist", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })    
        .then(function (response) {
            if (response.ok) {
              response.json().then(function (data) {
                console.log(data);
                genreType = data.artists.items[0].genres[0];
                console.log(genreType);
                apiUrl =  "https://api.spotify.com/v1/search?q=genre:" + genreType;
            })}
        })
        
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
    
}
//formatEl.addEventListener("click", vischeck);
btn.addEventListener("click", runSearch);
var displayResults = function(results) {
    listEl.innerHTML = "";
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
        songEl.src = "https://open.spotify.com/embed/track/" + results[i].id;
        listEntry.appendChild(songEl);
        listEl.appendChild(listEntry);               
    }
}