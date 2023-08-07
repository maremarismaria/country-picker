import "./style/style.scss";
import "./style/sprite.scss";

(function () {
  async function init() {
    try {
      const rawData = await fetch("./data/countries.json");
      const countries = await rawData.json();
      main(countries);
    } catch (error) {
      console.error(error.toString());
    }
  }

  function main(countries) {
    renderCountries(countries);
    selectCountryOnType();
    fillOnFocusOut();
    fillOnClickCountry();
    toggleCountryList();
    onClickOutsideCloseCountryList();
  }

  function renderCountries(countries) {
    countries.forEach((country) => {
      const countryItem = document.createElement("li");
      countryItem.setAttribute("id", country.iso2);
      countryItem.className = "country-item";

      const flagItem = document.createElement("div");
      flagItem.className = `flag ${country.iso2}`;

      const nameItem = document.createElement("span");
      nameItem.className = "country-name";
      nameItem.textContent = country.name;

      countryItem.appendChild(flagItem);
      countryItem.appendChild(nameItem);

      const countryList = document.querySelector(".country-picker .country-list");
      countryList.appendChild(countryItem);
    });
  }

  function selectCountryOnType() {
    const input = document.querySelector(".country-picker input[type=text]");
    const hiddenInput = document.querySelector(".country-picker input[type=hidden]");
    const flag = document.querySelector(".country-picker .selected-flag .flag");
    const countryItems = document.querySelectorAll(".country-picker .country-item");

    input.addEventListener("change", (event) => {
      const inputValue = event.target.value.trim().toLowerCase();

      for (const node of countryItems) {
        const name = node.textContent;
        const code = node.id;
        const inputMatchesCountry = !!inputValue.length && name.toLowerCase().startsWith(inputValue);

        if (inputMatchesCountry) {
          input.setAttribute("data-name", name);
          input.setAttribute("data-country-code", code);
          flag.className = `flag ${code}`;
          hiddenInput.value = code;
          break;
        }
      }
    });
  }

  function fillOnClickCountry() {
    const input = document.querySelector(".country-picker input[type=text]");
    const hiddenInput = document.querySelector(".country-picker input[type=hidden]");
    const flag = document.querySelector(".country-picker .selected-flag .flag");
    const countryItems = document.querySelectorAll(".country-picker .country-item");

    for (const node of countryItems) {
      node.addEventListener("click", (event) => {
        const name = event.currentTarget.textContent;
        const code = event.currentTarget.id;

        input.setAttribute("data-name", name);
        input.setAttribute("data-country-code", code);
        input.setAttribute("value", name);
        input.value = name;
        hiddenInput.value = code;
        flag.className = `flag ${code}`;
        closeCountryList();
      });
    }
  }

  function fillOnFocusOut() {
    const input = document.querySelector(".country-picker input[type=text]");
    const hiddenInput = document.querySelector(".country-picker input[type=hidden]");
    const flag = document.querySelector(".country-picker .selected-flag .flag");

    input.addEventListener("focusout", (event) => {
      if (input.hasAttribute("data-name") && input.hasAttribute("data-country-code")) {
        const name = input.getAttribute("data-name");
        const code = input.getAttribute("data-country-code");

        input.setAttribute("value", name);
        input.value = name;
        hiddenInput.value = code;
        flag.className = `flag ${code}`;
      }
    });
  }

  function toggleCountryList() {
    const toggler = document.querySelector(".country-picker .selected-flag");
    const arrow = document.querySelector(".country-picker .selected-flag .arrow");
    const ul = document.querySelector(".country-picker .country-list");

    toggler.addEventListener("click", (event) => {
      event.stopPropagation();
      arrow.classList.toggle("up");
      ul.classList.toggle("hidden");
    });
  }

  function closeCountryList() {
    const arrow = document.querySelector(".country-picker .selected-flag .arrow");
    const ul = document.querySelector(".country-picker .country-list");
    arrow.classList.remove("up");
    ul.classList.add("hidden");
  }

  function onClickOutsideCloseCountryList() {
    const toggler = document.querySelector(".country-picker .flag-dropdown");

    document.addEventListener("click", (event) => {
      event.stopPropagation();      
      if (!toggler.contains(event.currentTarget)) {
        closeCountryList();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
