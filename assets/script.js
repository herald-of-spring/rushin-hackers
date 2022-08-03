var token;
var apiKEY = "v5DBb7VL5CX6hGZ2TywJliIfauNyi2q0";//this is our key for ticketmaster calls
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
    search = searchEl.value;
    if (searchFormat === "location") {
        fetch("https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=" + searchEl.value + "&apikey=" + apiKEY)
        .then(function (response) {
            console.log(response.status);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            ticketMaster(data);
        })
    }
    if (searchFormat === "genre") {
        apiUrl = "https://api.spotify.com/v1/search?q=genre:" + searchEl.value;
        nowURL(apiUrl);//apiurl = fetch for spotify by genre using genreEl.value goes here
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
                nowURL(apiUrl);
            })}
        })
        
        //runs search for genres linked to searchEl.value and apiurl = fetches from spotify with that genre
    }
    console.log(apiUrl);
    localStorage.setItem("lastSearch", JSON.stringify(search));
}
function nowURL(apiUrl) {fetch(apiUrl + "&type=track", {
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
        var purchase = "https://www.ticketmaster.com/search?q=" + bandName
        var purchaseEl = document.createElement('a');
        purchaseEl.textContent = "Buy tickets here!";
        purchaseEl.setAttribute("href", purchase);
        listEntry.appendChild(purchaseEl);
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
//running ticketmaster things
var ticketMaster = function(data) {
    listEl.innerHTML = "";
    for (i = 0; i< 5; i++) {
        var bandName = data._embedded.events[i]._embedded.attractions[0].name;        
        var listEntry = document.createElement('div');
        var titleEl = document.createElement("span");
        titleEl.textContent = bandName;
        listEntry.appendChild(titleEl);
        var purchase = data._embedded.events[i]._embedded.attractions[0].url
        var purchaseEl = document.createElement('a');
        purchaseEl.textContent = "Buy tickets here!";
        purchaseEl.setAttribute("href", purchase);
        listEntry.appendChild(purchaseEl);
        var songEl = document.createElement('iframe');
        songEl.width = "300";
        songEl.height = "80";
        songEl.loading = "lazy";
        songEl.class = "iframe";
        songEl.style.border = "no";
        songFind(bandName, songEl);
        listEl.appendChild(songEl);
        listEl.appendChild(listEntry);
    }
}
var songFind = function(bandName, songEl) {
    fetch("https://api.spotify.com/v1/search?q=artist:" + bandName + "&type=track", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })    
        .then(function (response) {
            if (response.ok) {
              response.json().then(function (data) {
                console.log(data);        
                songEl.src = "https://open.spotify.com/embed/track/" + data.tracks.items[0].id; 
            })}
        })
}
function init(){
    var lastSearch = JSON.parse(localStorage.getItem("lastSearch"))
    if (lastSearch !== null) {
        searchEl.innerHTML = lastSearch;
    }
    else {
        return;
    }
}