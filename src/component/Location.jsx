import React, { useState, useEffect } from "react";

export default function Location() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [location, setLocation] = useState(false);

  // Fetch countries when component mounts
  useEffect(() => {
    getCountries();
  }, []);

  // Fetch the list of countries
  const getCountries = async () => {
    try {
      let response = await fetch(
        "https://crio-location-selector.onrender.com/countries"
      );
      let allCountries = await response.json();
      setCountries(allCountries);
    } catch (error) {
      setCountries([]);
    }
  };

  // Fetch states when a country is selected and hide location
  useEffect(() => {
    if (selectedCountry) {
      setStates([]);
      setCities([]); // Clear cities when country changes
      setLocation(false); // Hide location when changing country
      getStates();
    }
  }, [selectedCountry]);

  const getStates = async () => {
    try {
      let response = await fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
      );
      let allStates = await response.json();
      setStates(allStates);
    } catch (error) {
      setStates([]);
    }
  };

  // Fetch cities when a state is selected and hide location
  useEffect(() => {
    if (selectedState) {
      setCities([]);
      setLocation(false); // Hide location when changing state
      getCities();
    }
  }, [selectedState]);

  const getCities = async () => {
    try {
      let response = await fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      );
      let allCities = await response.json();
      setCities(allCities);
    } catch (error) {
      setCities([]);
    }
  };

  // Set location once city is selected
  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      setLocation(true); // Show location only when all fields are selected
    } else {
      setLocation(false); // Ensure location is hidden if any field is not selected
    }
  }, [selectedCity]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: 50,
        }}
      >
        {/* Country Dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{ padding: 15, width: 400, margin: 5 }}
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{ padding: 15, width: 200, margin: 5 }}
          disabled={!selectedCountry} // Enable when country is selected
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: 15, width: 200, margin: 5 }}
          disabled={!selectedState} // Enable when state is selected
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected location */}
      <div>
        {location && (
          <div>
            <span style={{ color: "black", fontWeight: 400 }}>
              You Selected{" "}
            </span>
            <span style={{ color: "black", fontWeight: "bold" }}>
              {selectedCity}
            </span>
            ,
            <span style={{ color: "#dddddd", fontWeight: "bold" }}>
              {" "}
              {selectedState}
            </span>
            ,
            <span style={{ color: "#dddddd", fontWeight: "bold" }}>
              {" "}
              {selectedCountry}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
