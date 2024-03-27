import React, { useState, useEffect } from 'react';

const RadioBrowserCountries = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [stations, setStations] = useState([]);

  // Fetch de la lista de países al cargar el componente
  useEffect(() => {
    fetch('https://de1.api.radio-browser.info/json/countries')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
      })
      .catch(error => console.log('Error fetching countries:', error));
  }, []);

  // Fetch de las estaciones de radio para el país seleccionado cuando este cambia
  useEffect(() => {
    if (selectedCountry) {
      fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(selectedCountry)}`)
        .then(response => response.json())
        .then(data => {
          setStations(data);
        })
        .catch(error => console.log('Error fetching stations:', error));
    } else {
      setStations([]); // Limpia la lista de estaciones si no hay país seleccionado
    }
  }, [selectedCountry]);

  return (
    <div>
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
      >
        <option value="">Select a country</option>
        {countries.map((country, index) => (
          <option key={index} value={country.name}>
            {country.name} ({country.stationcount} stations)
          </option>
        ))}
      </select>

      {selectedCountry && (
        <div>
          <h2>Stations in {selectedCountry}:</h2>
          <ul>
            {stations.map((station, index) => (
              <li key={index}>{station.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RadioBrowserCountries;
