let genresSelected = [];
let ratingsSelected = [];

document.addEventListener("DOMContentLoaded", () => {
  const newSearch = document.getElementById("newsearch");
  const checkboxes = document.querySelectorAll(".btn-check");
  const ratings = document.querySelectorAll(".form-check-input");

  // Update Genre selection to the array genresSelected
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        genresSelected.push(checkbox.value);
      } else {
        delete genresSelected[genresSelected.indexOf(checkbox.value)];
      }
      genresSelected = genresSelected.filter(function () {
        return true;
      });
    });
  });

  // Update age rating selection to the array ratingsSelected
  ratings.forEach((rating) => {
    rating.addEventListener("change", (event) => {
      if (event.target.checked) {
        ratingsSelected.push(rating.value);
      } else {
        delete ratingsSelected[ratingsSelected.indexOf(rating.value)];
      }
      ratingsSelected = ratingsSelected.filter(function () {
        return true;
      });
    });
  });

  // upon form submittion, save the two arrays to localStorage, then load results.html
  newSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    
    if (!genresSelected.length) {
      ratings.forEach((rating) => {
        rating.addEventListener("change", (event) => {
          if (event.target.checked) {
            ratingsSelected.push(rating.value);
          } else {
            delete ratingsSelected[ratingsSelected.indexOf(rating.value)];
          }
          ratingsSelected = ratingsSelected.filter(function () {
            return true;
          });
        });
      });      
    }

    localStorage.setItem("selectGenres", JSON.stringify(genresSelected));
    localStorage.setItem("selectRatings", JSON.stringify(ratingsSelected));

    window.location.href = "results.html";
  });
});

// list view
async function getAllRecords() {
  let getResultElement = document.getElementById("shows");
  let serviceContainer = document.getElementById("services");

  serviceContainer.style.visibility = "hidden";

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer pat2MfWJoPBcQuVNM.04f46729db1b73befcf2b448c6690677f2d5ef8cd9a50ee7c098c32169bb43b8`,
    },
  };

  await fetch(`https://api.airtable.com/v0/appvUUXsd09TFLZWq/Shows`, options)
    .then((response) => response.json())
    .then((data) => {
      getResultElement.innerHTML = ""; // clear shows

      // load selected genres and ratings from local storage
      const loadGenres = JSON.parse(localStorage.getItem("selectGenres"));
      const loadRatings = JSON.parse(localStorage.getItem("selectRatings"));

      var filteredData = filterRecords(data.records, loadGenres, loadRatings);
      let newHtml = `<div class="row row-cols-1 row-cols-md-3 m-2 g-4">`;

      for (let i = 0; i < filteredData.length; i++) {
        let name = filteredData[i].fields["Name"]; // here we are getting column values
        let age_rating = filteredData[i].fields["Age Rating"];
        let rating = filteredData[i].fields["Average Rating"]; // here we are getting column values
        let description = fixTextOverlap(filteredData[i].fields["Description"]);
        let picture = filteredData[i].fields["Picture"];

        newHtml += `
          
        <div class="col">
         <a href="results.html?id=${
           filteredData[i].id
         }" style="text-decoration: none;">
            <div class="result card h-100 mx-3">
              <div class="idle">
             ${
               picture
                 ? `<img src="${picture[0].url}" 
                class="card-img-top placeholder text-center text-light bg-secondary
                alt=${name}">`
                 : ``
             }
                <div class="card-body">
                  <h5 class="card-title text-light">${name}</h5>
                </div>
              </div>
              <div class="more-info p-2">
                <div class="card-body" >
                  <h5 class="text-light fs-6">${name}</h5>
                  <h5 class="text-light fs-6">${stars(rating)}</h5>
                  <h5 class="text-light fs-6">${age_rating}</h5>
                  <p class="text-light">${description}</p>
                </div>
              </div>
            </div>
          </a>
        </div>
        `;
      }

      getResultElement.innerHTML = newHtml + `</div>`;
    });
}

// prevent the description text from escaping the card in the list view
function fixTextOverlap(description) {
  let words = description.split(" ");

  if (description.length > 370) {
    for (let i = 0; i < words.length; i++) {
      words.pop();
    }

    return words.toString().replaceAll(",", " ") + "...";
  }

  return description;
}

function filterRecords(records, genresSelected, ratingsSelected) {
  let filteredData = [];
  
  // Select all ratings if the user has no preferene for it (ratingsSelected is empty)
  if (!ratingsSelected.length) {
    
  }
    
  records.forEach((record) => {
    const genres = record.fields["Genres"].split(",");
    const rating = record.fields["Age Rating"];

    
    if (!ratingsSelected.includes(rating)) {
      return filteredData;
    }

    for (let i = 0; i < genresSelected.length; i++) {
      for (let j = 0; j < genres.length; j++) {
        if (genresSelected[i] === genres[j]) {
          filteredData.push(record);
          i = genresSelected.length;
        }
      }
    }
  });

  return filteredData;
}

function displayStreamingServices(availableServices) {
  let availableServicesHTML = document.getElementById("availableServices");
  let html = "";

  const services = new Map([
    [
      "Netflix",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/netflix.png?v=1723073487559",
    ],
    [
      "Hulu",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/5bbc0d9c8f350.jpg?v=1723073490350",
    ],
    [
      "Peacock",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/Peacock-Emblem.png?v=1723073482514",
    ],
    [
      "Crunchyroll",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/Crunchyroll_logo_2012v.png?v=1723073474137",
    ],
    [
      "Freevee",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/freevee.png?v=1723073472180",
    ],
    [
      "Prime Video",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/primevideo.png?v=1723073470070",
    ],
    [
      "Disney+",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/disneyplus.jpg?v=1723073480473",
    ],
    [
      "ABC",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/abc.png?v=1723073478376",
    ],
    [
      "FXNOW",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/fxnow.png?v=1723073476069",
    ],
    [
      "Paramount+",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/Paramount_Plus.svg.png?v=1723075119994",
    ],
    [
      "Adult Swim",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/as.png?v=1723076813514",
    ],
    [
      "Max",
      "https://cdn.glitch.global/8645755e-9086-4de4-8385-f969bbfe9f55/max.png?v=1723076871187",
    ],
  ]);

  availableServices.forEach((service) => {
    if (availableServices.includes(service)) {
      html += `
      <div class="services col">
        <img src="${services.get(
          service
        )}" alt="${service}">
      </div>
      `;
    }
  });

  // console.log(html);
  availableServicesHTML.innerHTML = html;
}

async function getMoreGenres() {
  const url = "https://unogs-unogs-v1.p.rapidapi.com/static/genres";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "c34be448dfmsh6003cc14658deb8p144782jsn2d810b4d14d6",
      "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(JSON.parse(result));
  } catch (error) {
    console.error(error);
  }
}

// displays genre checkboxes
function displayGenres() {
  const genres = [
    "Fantasy",
    "Crime",
    "Action",
    "Adventure",
    "Comedy",
    "Animation",
    "Mystery",
    "Drama",
    "Thriller",
    "Horror",
  ];
  
  // genres.forEach

  // get the div for the genre checkbox section and load them from the array above
  let input = document.getElementById("genres");
  input.innerHTML = "";

  let newHtml = "";
  let btnCheck = 1;

  for (let i = 0; i < genres.length; i++) {
    newHtml += `
        <div class="col">
          <input type="checkbox" class="btn-check" id="btn-check-${btnCheck}" value="${
      genres[i]
    }" autocomplete="off">
          <label class="btn btn-primary" for="btn-check-${btnCheck++}">${
      genres[i]
    }</label>
        </div>
    `;
  }
  input.innerHTML = newHtml;
}

//function to convert the number rating from Airtable to star images
function stars(rating) {
  if (rating === 1) {
    return "⭐️";
  } else if (rating === 2) {
    return "⭐⭐";
  } else if (rating === 3) {
    return "⭐⭐⭐";
  } else if (rating === 4) {
    return "⭐⭐⭐⭐";
  } else if (rating === 5) {
    return "⭐⭐⭐⭐⭐";
  }
}

// arg: array of genres
function addGenreBadges(genres) {
  let badgeHTML = "";
  const genreArr = genres.split(","); // parse to array for

  // add divs for flex row
  genreArr.forEach((genre) => {
    badgeHTML += `
    <div class="p-2">
      <h5><span class="badge text-bg-secondary">${genre}</span></h5>
    </div>
    `;
  });
  return badgeHTML;
}

// detailed view
async function getOneRecord(id) {
  let showResultElement = document.getElementById("shows");

  document.getElementById("prefHeader").style.display = "none";

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer pat2MfWJoPBcQuVNM.04f46729db1b73befcf2b448c6690677f2d5ef8cd9a50ee7c098c32169bb43b8`,
    },
  };

  await fetch(
    `https://api.airtable.com/v0/appvUUXsd09TFLZWq/Shows/${id}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      let name = data.fields["Name"]; // here we are getting column values
      let age_rating = data.fields["Age Rating"];
      let time_aired = data.fields["Time Aired"];
      let rating = data.fields["Average Rating"]; // here we are getting column values
      let genres = data.fields["Genres"];
      let description = data.fields["Description"];
      let picture = data.fields["Picture"];
      let services = data.fields["Available Streaming Services"];

      let genreBadges = addGenreBadges(genres);
      displayStreamingServices(services.split(", "));

      console.log(fixTextOverlap(description));
      console.log(description);

      let newHtml = `
      <div class="container-fluid bg-primary d-flex justify-content-center">
      ${
        picture
          ? `<img class="img-fluid" alt="${name}" src="${picture[0].url}" 
         style="height: 20rem; width: 30rem;">`
          : ``
      }
      </div>
      <div class="container-fluid" style="background-color: #272935;">
      <div class="card mb-3 bg-dark mb-5">
        <div class="row g-0">
          <div class="col-md-2">
          </div>
          <div class="col text-light">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text mb-2"><small>${stars(rating)}</small></p>
              <p class="card-text">${description}</p>
            </div>
        </div> 
       <div class="d-flex flex-row">
         <div class="col-md-2">
         </div>
            ${genreBadges}
        </div>
      </div>
      `;

      showResultElement.innerHTML = newHtml;
    });
}

// look up window.location.search and split, so this would take
// https://dmspr2021-airtable-app.glitch.me/index.html?id=receHhOzntTGZ44I5
// and look at the ?id=receHhOzntTGZ44I5 part, then split that into an array
// ["?id=", "receHhOzntTGZ44I5"] and then we only choose the second one
let idParams = window.location.search.split("?id=");
if (idParams.length >= 2) {
  // has at least ["?id=", "OUR ID"]
  getOneRecord(idParams[1]); // create detail view HTML w/ our id
} else {
  getAllRecords(); // no id given, fetch summaries
}

displayGenres();
