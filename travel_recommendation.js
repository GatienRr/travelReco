// Function to normalize and check if a string includes a keyword
const includesKeyword = (str, keyword) => {
  return str.toLowerCase().includes(keyword.toLowerCase());
};

// Function to search travel data
function searchTravelData(searchTerm) {
  return fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const results = [];
      const countryKeywords = ['country', 'countries'];

      // Check if search is for country or country name
      const isCountrySearch = countryKeywords.some(keyword => includesKeyword(searchTerm, keyword)) ||
                              data.countries.some(country => includesKeyword(country.name, searchTerm));

      if (isCountrySearch) {
        // If country search, only return cities
        data.countries.forEach(country => {
          if (includesKeyword(country.name, searchTerm) || countryKeywords.some(keyword => includesKeyword(searchTerm, keyword))) {
            country.cities.forEach(city => {
              results.push({ type: 'city', country: country.name, ...city });
            });
          }
        });
      } else {
        // If not country search, search all categories
        const beachKeywords = ['beach', 'beaches'];
        const templeKeywords = ['temple', 'temples'];

        // Search cities
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            if (includesKeyword(city.name, searchTerm) || includesKeyword(city.description, searchTerm)) {
              results.push({ type: 'city', country: country.name, ...city });
            }
          });
        });

        // Search temples
        if (templeKeywords.some(keyword => includesKeyword(searchTerm, keyword))) {
          results.push(...data.temples.map(temple => ({ type: 'temple', ...temple })));
        } else {
          data.temples.forEach(temple => {
            if (includesKeyword(temple.name, searchTerm) || includesKeyword(temple.description, searchTerm)) {
              results.push({ type: 'temple', ...temple });
            }
          });
        }

        // Search beaches
        if (beachKeywords.some(keyword => includesKeyword(searchTerm, keyword))) {
          results.push(...data.beaches.map(beach => ({ type: 'beach', ...beach })));
        } else {
          data.beaches.forEach(beach => {
            if (includesKeyword(beach.name, searchTerm) || includesKeyword(beach.description, searchTerm)) {
              results.push({ type: 'beach', ...beach });
            }
          });
        }
      }

      return results;
    });
}

// Function to display results
function displayResults(results) {
  resultsContainer.innerHTML = ''; // Clear previous results
  if (results.length === 0) {
    showPopup("No results found. Try searching for 'country', 'beach', or 'temple'.");
    return;
  }
  results.forEach(item => {
    const resultElement = document.createElement('div');
    resultElement.innerHTML = `
      <h3>${item.name}</h3>
      <p>Type: ${item.type}</p>
      ${item.country ? `<p>Country: ${item.country}</p>` : ''}
      <img src="${item.imageUrl}" alt="${item.name}" style="width: 200px;" class="center">
      <p>${item.description}</p>
    `;
    resultsContainer.appendChild(resultElement);
  });
}

// Function to show popup
function showPopup(message) {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid black;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 1000;
  `;
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 3000);
}

// Example usage
const searchField = document.getElementById('search-field');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const resultsContainer = document.getElementById('results-container');

searchButton.addEventListener('click', () => {
  const searchTerm = searchField.value;
  searchTravelData(searchTerm)
    .then(displayResults)
    .catch(error => console.error('Error:', error));
});

clearButton.addEventListener('click', () => {
  searchField.value = '';
  resultsContainer.innerHTML = '';
});