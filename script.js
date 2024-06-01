// credits to RapidAPI for this part of code.
const options = {
    method: 'GET',
    url: 'https://airport-info.p.rapidapi.com/airport',
    params: { iata: '' },
    headers: {
      'X-RapidAPI-Key': '88e65ffcd5msh8cc7084f533cfd8p13000bjsn93db5bd51e35',
      'X-RapidAPI-Host': 'airport-info.p.rapidapi.com'
    }
  };
  
  let airportCache = {};
  
  async function fetchAirportData(iataCode) {
    if (airportCache[iataCode]) {
      return airportCache[iataCode];
    }
  
    const url = `${options.url}?iata=${iataCode}`;
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      airportCache[iataCode] = data;
      return data;
    } catch (error) {
      console.error("Error fetching airport data:", error);
      return null;
    }
  }
  
  function autocomplete(input, resultsBox) {
    input.addEventListener("input", debounce(async function () {
      const query = input.value.trim().toUpperCase();
      resultsBox.innerHTML = '';
  
      if (query.length < 3) {
        resultsBox.style.display = 'none';
        return;
      }
  
      const airportData = query === "" ? allAirports : await fetchAirportData(query);

      if (Array.isArray(airportData)) {
        const filteredAirports = airportData.filter(airport => {
          const name = airport.name.toUpperCase();
          const iata = airport.iata.toUpperCase();
          return name.includes(query) || iata.includes(query);
        });

        filteredAirports.forEach(airport => {
          const option = document.createElement('div');
          option.innerHTML = `<strong>${airport.name}</strong> (${airport.iata}) - ${airport.country}`;
          option.classList.add('autocomplete-item');
          option.addEventListener('click', function () {
            input.value = airport.name;
            resultsBox.innerHTML = '';
          });
          resultsBox.appendChild(option);
        });
  
        if (filteredAirports.length === 0) {
          resultsBox.innerHTML = '<div class="autocomplete-item">No airports found</div>';
        }
  
        resultsBox.style.display = 'block';

      } else if (airportData) { 
        const option = document.createElement('div');
        option.innerHTML = `<strong>${airportData.name}</strong> (${airportData.iata}) - ${airportData.country}`;
        option.classList.add('autocomplete-item');
        option.addEventListener('click', function () {
          input.value = airportData.name;
          resultsBox.innerHTML = '';
        });
        resultsBox.appendChild(option);
        resultsBox.style.display = 'block';
      } else {
        resultsBox.innerHTML = '<div class="autocomplete-item">No airports found</div>';
        resultsBox.style.display = 'block';
      }
    }, 300));
  }
  
  // Credits : https://www.freecodecamp.org/news/javascript-debounce-example/
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  const departureInput = document.getElementById('departureInput');
  const departureResultsBox = document.getElementById('departureAirportResults');
  autocomplete(departureInput, departureResultsBox);
  
  const destinationInput = document.getElementById('destinationInput');
  const destinationResultsBox = document.getElementById('destinationAirportResults');
  autocomplete(destinationInput, destinationResultsBox); // Call is needed
  
   // Flight Results (Simulation)
  document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flight-search-form');
    const flightResultsSection = document.getElementById('flight-results');
    const flightResultsBody = flightResultsSection.querySelector('tbody');
    const simulatedFlights = [
        {
            airline: "Singapore Airlines",
            price: "550 SGD",
            departure: "SIN 10:00",
            arrival: "KUL 11:15"
        },
        {
            airline: "British Airways",
            price: "1480 SGD",
            departure: "SIN 12:30",
            arrival: "JFK 23:45"
        },
        {
            airline: "Emirates",
            price: "1550 SGD",
            departure: "SIN 15:15",
            arrival: "LHR 22:00"
        },
    ];

    flightSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        displayFlightResults(simulatedFlights);
    });

    function displayFlightResults(data) {
        flightResultsBody.innerHTML = ""; // Clear previous results

        if (data.length === 0) {
            const noResultsRow = flightResultsBody.insertRow();
            const noResultsCell = noResultsRow.insertCell();
            noResultsCell.colSpan = 4; 
            noResultsCell.textContent = "No flights found.";
            return;
        }

        data.forEach(flight => {
            const row = flightResultsBody.insertRow();
            row.insertCell().textContent = flight.airline;
            row.insertCell().textContent = flight.price;
            row.insertCell().textContent = flight.departure;
            row.insertCell().textContent = flight.arrival;
        });
    }
});

fetchAirports();
