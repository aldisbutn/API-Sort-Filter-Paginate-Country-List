import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  class Currency {
    constructor(
      public name: string,
      public symbol: string
      ) {}
  }

  class Language {
    constructor(
      public name: string
      ) {}
  }

  class Country {
    constructor(
      public name: string,
      public capital: string,
      public currency: Currency,
      public language: Language
    ) {}

    renderTableRow(): HTMLTableRowElement {
      const row = document.createElement("tr");

      const nameCell = row.insertCell(0);
      nameCell.textContent = this.name;

      const capitalCell = row.insertCell(1);
      capitalCell.textContent = this.capital;

      const currencyCell = row.insertCell(2);
      currencyCell.textContent = `${this.currency.name} (${this.currency.symbol})`;

      const languageCell = row.insertCell(3);
      languageCell.textContent = this.language.name;

      return row;
    }
  }

  const tableBody = document.querySelector(".js-table-body");
  const countriesPerPage = 20;
  const pagination = document.querySelector(".js-pagination");

  const search = document.querySelector(".js-search");
  const countryNameInput = search.querySelector<HTMLInputElement>('input[name="countryName"]');
  const capitalInput = search.querySelector<HTMLInputElement>('input[name="capital"]');
  const currencyInput = search.querySelector<HTMLInputElement>('input[name="currencyName"]');
  const languageInput = search.querySelector<HTMLInputElement>('input[name="languageName"]');

  const countryNameSortButton = document.querySelector<HTMLButtonElement>('.js-country-sort');
  const capitalSortButton = document.querySelector<HTMLButtonElement>('.js-capital-sort');
  const currencyNameSortButton = document.querySelector<HTMLButtonElement>('.js-currency-sort');
  const languageNameSortButton = document.querySelector<HTMLButtonElement>('.js-language-sort');

  const countryNameSortIcon = document.querySelector('.js-country-sort-icon');
  const capitalSortIcon = document.querySelector('.js-capital-sort-icon');
  const currencyNameSortIcon = document.querySelector('.js-currency-sort-icon');
  const languageNameSortIcon = document.querySelector('.js-language-sort-icon');

  axios.get<Country[]>(`http://localhost:3004/countries`).then((response) => {
    const data = response.data;
    displayCountries(data.slice(0, countriesPerPage));
    addPagination(data);
  });

  // Display the table of countries
  const displayCountries = (countries: Country[]) => {
    tableBody.innerHTML = "";

    countries.forEach((country) => {
      const countryInstance = new Country(
        country.name,
        country.capital,
        new Currency(country.currency.name, country.currency.symbol),
        new Language(country.language.name)
      );
      const row = countryInstance.renderTableRow();
      tableBody.appendChild(row);
    });
  };

  // Pagination
  const addPagination = (data: Country[]) => {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(data.length / countriesPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.classList.add("button");
      pageButton.classList.add("is-info");
      pageButton.classList.add("is-outlined");
      pageButton.textContent = i.toString();
      pageButton.addEventListener("click", () => {
        const startIndex = (i - 1) * countriesPerPage;
        const endIndex = startIndex + countriesPerPage;

        displayCountries(data.slice(startIndex, endIndex));
      });

      pagination.appendChild(pageButton);
    }
  };

  // Search
  const countrySearch = () => {
    const countryNameValue = countryNameInput.value;
    console.log(countryNameValue);

    axios.get<Country[]>(`http://localhost:3004/countries?name_like=${countryNameValue}`).then((response) => {
        const data = response.data;
        displayCountries(data.slice(0, countriesPerPage));
      });
  };
  countryNameInput.addEventListener("input", countrySearch);

  const capitalSearch = () => {
    const capitalValue = capitalInput.value;
    console.log(capitalValue);

    axios.get<Country[]>(`http://localhost:3004/countries?capital_like=${capitalValue}`).then((response) => {
        const data = response.data;
        displayCountries(data.slice(0, countriesPerPage));
      });
  };
  capitalInput.addEventListener("input", capitalSearch);

  const currencySearch = () => {
    const currencyValue = currencyInput.value
      .split(",")
      .map((lang) => `currency.name_like=${lang.trim()}`)
      .join("&");
    console.log(currencyValue);

    axios.get<Country[]>(`http://localhost:3004/countries?${currencyValue}`).then((response) => {
        const data = response.data;
        displayCountries(data.slice(0, countriesPerPage));
      });
  };
  currencyInput.addEventListener("input", currencySearch);

  const languageSearch = () => {
    const languageValue = languageInput.value
      .split(",")
      .map((lang) => `language.name_like=${lang.trim()}`)
      .join("&");
    console.log(languageValue);

    axios.get<Country[]>(`http://localhost:3004/countries?${languageValue}`).then((response) => {
        const data = response.data;
        displayCountries(data.slice(0, countriesPerPage));
      });
  };
  languageInput.addEventListener("input", languageSearch);

// Sort
  let countryIsAscending = false;
  const countrySort = () => {
    const sortOrder = countryIsAscending ? 'asc' : 'desc';
    const sortIcon = countryIsAscending ? 'fa-caret-up' : 'fa-caret-down';

    countryNameSortIcon.classList.remove('fa-caret-up', 'fa-caret-down');
    countryNameSortIcon.classList.add(`${sortIcon}`);
    
    axios.get<Country[]>(`http://localhost:3004/countries?_sort=name&_order=${sortOrder}`).then((response) => {
      const data = response.data;
      displayCountries(data.slice(0, countriesPerPage));
    });
    countryIsAscending = !countryIsAscending;
  };
  countryNameSortButton.addEventListener("click", countrySort);

  let capitalIsAscending = false;
  const capitalSort = () => {
    const sortOrder = capitalIsAscending ? 'asc' : 'desc';
    const sortIcon = capitalIsAscending ? 'fa-caret-up' : 'fa-caret-down';

    capitalSortIcon.classList.remove('fa-caret-up', 'fa-caret-down');
    capitalSortIcon.classList.add(`${sortIcon}`);

    axios.get<Country[]>(`http://localhost:3004/countries?_sort=capital&_order=${sortOrder}`).then((response) => {
      const data = response.data;
      displayCountries(data.slice(0, countriesPerPage));
    });
    capitalIsAscending = !capitalIsAscending;
  }
  capitalSortButton.addEventListener("click", capitalSort);

  let currencyNameIsAscending = false;
  const currencyNameSort = () => {
    const sortOrder = currencyNameIsAscending ? 'asc' : 'desc';
    const sortIcon = currencyNameIsAscending ? 'fa-caret-up' : 'fa-caret-down';

    currencyNameSortIcon.classList.remove('fa-caret-up', 'fa-caret-down');
    currencyNameSortIcon.classList.add(`${sortIcon}`);

    axios.get<Country[]>(`http://localhost:3004/countries?_sort=currency.name&_order=${sortOrder}`).then((response) => {
      const data = response.data;
      displayCountries(data.slice(0, countriesPerPage));
    });
    currencyNameIsAscending = !currencyNameIsAscending;
  }
  currencyNameSortButton.addEventListener("click", currencyNameSort);

  let languageNameIsAscending = false;
  const clanguageNameSort = () => {
    const sortOrder = languageNameIsAscending ? 'asc' : 'desc';
    const sortIcon = languageNameIsAscending ? 'fa-caret-up' : 'fa-caret-down';

    languageNameSortIcon.classList.remove('fa-caret-up', 'fa-caret-down');
    languageNameSortIcon.classList.add(`${sortIcon}`);

    axios.get<Country[]>(`http://localhost:3004/countries?_sort=language.name&_order=${sortOrder}`).then((response) => {
      const data = response.data;
      displayCountries(data.slice(0, countriesPerPage));
    });
    languageNameIsAscending = !languageNameIsAscending;
  }
  languageNameSortButton.addEventListener("click", clanguageNameSort);
});
