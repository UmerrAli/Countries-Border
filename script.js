"use strict";

const countriesContainer = document.querySelector(".countries");
const form = document.querySelector(".search-container");
const serchfield = document.querySelector("#country-search");

const renderCountry = function (response, className = "") {
  const html = `
     <article class="country ${className}">
         <img class="country__img" src="${response.flags.png}" />
             <div class="country__data">
                 <h3 class="country__name">${response.name.official}</h3>
                 <h4 class="country__region">${response.region}</h4>
                 <p class="country__row"><span>👫</span>${(response.population / 1000000).toFixed(1)} M</p>
                 <p class="country__row"><span>🗣️</span>${Object.values(response.languages)[0]}</p>
                 <p class="country__row"><span>💰</span>${Object.values(response.currencies)[0].name}</p>
             </div>
     </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (msg) {
  const error = document.createElement("h2");
  error.classList.add("error");
  error.textContent = msg;
  countriesContainer.insertAdjacentElement("beforeend", error);
};

const getCountryAndNeighbours = function (e) {
  e.preventDefault();
  countriesContainer.innerHTML = "";

  const country = serchfield.value;

  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then(response => {
      if (!response.ok) throw new Error(`Country not found (${response.status}) 🙁`);
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);

      if (!data[0].borders) throw new Error("No neighbours found!");

      data[0].borders.forEach(border => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then(response => response.json())
          .then(data => renderCountry(data[0], "neighbour"));
      });
    })
    .catch(err => {
      console.log(err.message);
      renderError(err.message);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

form.addEventListener("submit", getCountryAndNeighbours);
