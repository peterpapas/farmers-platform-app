import "../App.css";
import ApiCall from "../components/apicall";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "@mui/material/Slider";
import LocationButton from "../components/LocationButton";

function Weather() {
  const [width, setWidth] = useState(window.innerWidth);
  const [city, setCity] = useState("");
  const [LAT, setLat] = useState(null);
  const [LON, setLon] = useState(null);
  const [SliderMaxTempValue, setSliderMaxTempValue] = useState(27);
  const [SliderMinTempValue, setSliderMinTempValue] = useState(10);
  const [SliderIdealMaxTempValue, setSliderIdealMaxTempValue] = useState(10);
  const [SliderIdealMinTempValue, setSliderIdealMinTempValue] = useState(18);
  const [SliderMaxHumidityValue, setSliderMaxHumidityValue] = useState(70);
  const [SliderMinHumidityValue, setSliderMinHumidityValue] = useState(60);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLocationChange = (lat, lon) => {
    setLat(lat);
    setLon(lon);
  };

  const handleResize = () => setWidth(window.innerWidth);

  const handleSliderMaxTempValueChange = (event) => {
    setSliderMaxTempValue(parseInt(event.target.value));
  };

  const handleSliderMinTempValueChange = (event) => {
    setSliderMinTempValue(parseInt(event.target.value));
  };

  const handleSliderMaxHumidityValueChange = (event) => {
    setSliderMaxHumidityValue(parseInt(event.target.value));
  };

  const handleSliderMinHumidityValueChange = (event) => {
    setSliderMinHumidityValue(parseInt(event.target.value));
  };

  const handleSliderIdealMaxTempValueChange = (event) => {
    setSliderIdealMaxTempValue(parseInt(event.target.value));
  };

  const handleSliderIdealMinTempValueChange = (event) => {
    setSliderIdealMinTempValue(parseInt(event.target.value));
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const fetchWeather = () => {
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;

    if (city) {
      axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        )
        .then((response) => {
          if (response.data.length > 0) {
            setLat(response.data[0].lat);
            setLon(response.data[0].lon);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center">
      <div className="bg-white max-w-md mx-auto rounded-lg shadow-xl p-6">
        <div className="text-center">
          <p className="text-2xl">🌾Wheat🌾</p>
          <p className="text-lg font-semibold mb-4">Custom Weather Forecast</p>
        </div>
        <hr className="my-4" />
        <p className="text-sm mb-4">
          You can use your current location or search for the city that you
          would like to check if the weather would be optimal for wheat growth.
        </p>
        <div className="mb-4">
          <LocationButton onLocationChange={handleLocationChange} />
        </div>
        <form onSubmit={handleSearch}>
          <label
            htmlFor="cityname"
            className="block font-medium text-gray-700 mb-2"
          >
            City Name:
          </label>
          <div className="flex">
            <input
              id="cityname"
              className={`flex-1 w-full px-4 py-2 border rounded-md bg-white text-gray-900 ${
                city.length === 0
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              } focus:outline-none focus:ring-2 transition duration-300 ease-in-out`}
              placeholder="Name of the city"
              type="text"
              value={city}
              onChange={handleCityChange}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300 ease-in-out"
            >
              Search
            </button>
          </div>
        </form>

        <hr className="my-4" />
        <p className="text-sm mb-4">
          Provide custom absolute 'maximum' and 'minimum' temperatures that you
          would like to get results for.
        </p>
        <div className="mb-4">
          <p className="mb-2">
            Absolute Maximum Temperature: {SliderMaxTempValue}°C
          </p>
          <Slider
            getAriaLabel={() => "Temperature range"}
            onChange={handleSliderMaxTempValueChange}
            valueLabelDisplay="auto"
            defaultValue={27}
            // getAriaValueText={SliderValue}
            min={-100}
            max={100}
          />
        </div>
        <div className="mb-4">
          <p className="mb-2">
            Absolute Minimum Temperature: {SliderMinTempValue}°C
          </p>
          <Slider
            getAriaLabel={() => "Temperature range"}
            onChange={handleSliderMinTempValueChange}
            valueLabelDisplay="auto"
            defaultValue={10}
            // getAriaValueText={SliderValue}
            min={-100}
            max={100}
          />
        </div>
        <hr className="my-4" />
        <p className="text-sm mb-4">
          Provide custom ideal 'maximum' and 'minimum' temperatures that you
          would like to get results for.
        </p>
        <div className="mb-4">
          <p className="mb-2">
            Ideal Maximum Temperature: {SliderIdealMaxTempValue}°C
          </p>
          <Slider
            getAriaLabel={() => "Temperature range"}
            onChange={handleSliderIdealMaxTempValueChange}
            valueLabelDisplay="auto"
            defaultValue={24}
            // getAriaValueText={SliderValue}
            min={-100}
            max={100}
          />
        </div>
        <hr />
        {/* Custom Ideal Temps*/}
        <p>
          Provide custom Ideal 'maximum' and 'minimum' tempretures that would
          you like to get results for.
        </p>
        <p>Ideal Maximum Temperature: {SliderIdealMaxTempValue}°C</p>

        <Slider
          getAriaLabel={() => "Temperature range"}
          onChange={handleSliderIdealMaxTempValueChange}
          valueLabelDisplay="auto"
          defaultValue={24}
          // getAriaValueText={SliderValue}
          min={-100}
          max={100}
        />
        <p>Ideal Minimum Temperature: {SliderIdealMinTempValue}°C</p>
        <Slider
          getAriaLabel={() => "Temperature range"}
          onChange={handleSliderIdealMinTempValueChange}
          valueLabelDisplay="auto"
          defaultValue={18}
          // getAriaValueText={SliderValue}
          min={-100}
          max={100}
        />
        <hr />
        <p>Provide custom Humidity that would you like to get results for.</p>
        <p>Max Humidity: {SliderMaxHumidityValue}%</p>
        <Slider
          getAriaLabel={() => "Temperature range"}
          onChange={handleSliderMaxHumidityValueChange}
          valueLabelDisplay="auto"
          defaultValue={70}
          // getAriaValueText={SliderValue}
          min={0}
          max={100}
        />
        <p>Min Humidity: {SliderMinHumidityValue}%</p>
        <Slider
          getAriaLabel={() => "Temperature range"}
          onChange={handleSliderMinHumidityValueChange}
          valueLabelDisplay="auto"
          defaultValue={60}
          // getAriaValueText={SliderValue}
          min={0}
          max={100}
        />
        {LAT && LON ? (
          <ApiCall
            LAT={LAT}
            LON={LON}
            SliderMaxTempValue={SliderMaxTempValue}
            SliderMinTempValue={SliderMinTempValue}
            SliderMaxHumidityValue={SliderMaxHumidityValue}
            SliderMinHumidityValue={SliderMinHumidityValue}
            SliderIdealMaxTempValue={SliderIdealMaxTempValue}
            SliderIdealMinTempValue={SliderIdealMinTempValue}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Weather;
