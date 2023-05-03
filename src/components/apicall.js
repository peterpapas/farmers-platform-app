import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function ApiCall(props) {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({});
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [cityName, setCityName] = useState("");
  const [maxTemp, setMaxTemp] = useState(0);
  const [minTemp, setMinTemp] = useState(0);
  const [wheatMinMaxTemperature, setWheatMinMaxTemperature] = useState(false);
  const [wheatIdealTemperature, setWheatIdealTemperature] = useState(false);
  const [wheatIdealHumidity, setWheatIdealHumidity] = useState(false);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [wheatIdealTemperatureWeekly, setWheatIdealTemperatureWeekly] =
    useState(false);
  const [wheatIdealHumidityWeekly, setWheatIdealHumidityWeekly] =
    useState(false);

  const wheat = useMemo(
    () => ({
      minMaxTemperature: [props.SliderMinTempValue, props.SliderMaxTempValue],
      idealTemperature: [
        props.SliderIdealMinTempValue,
        props.SliderIdealMaxTempValue,
      ],
      idealHumidity: [
        props.SliderMinHumidityValue,
        props.SliderMaxHumidityValue,
      ],
    }),
    [
      props.SliderMinTempValue,
      props.SliderMaxTempValue,
      props.SliderMinHumidityValue,
      props.SliderMaxHumidityValue,
      props.SliderIdealMinTempValue,
      props.SliderIdealMaxTempValue,
    ]
  );

  useEffect(() => {
    // Testing Lat and Long values
    console.log("LAT:", props.LAT);
    console.log("LON:", props.LON);
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${props.LAT}&lon=${props.LON}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
        setTemperature(response.data.main.temp);
        setHumidity(response.data.main.humidity);
        setWindSpeed(response.data.wind.speed);
        setCityName(response.data.name);
        setMaxTemp(props.SliderMaxTempValue);
        setMinTemp(props.SliderMinTempValue);
        // Weekly forecast
        setWeeklyForecast(response.data.list.slice(0, 7));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    props.LAT,
    props.LON,
    props.SliderMaxTempValue,
    props.SliderMinTempValue,
    props.SliderMinHumidityValue,
    props.SliderMaxHumidityValue,
    props.SliderIdealMinTempValue,
    props.SliderIdealMaxTempValue,
  ]);

  useEffect(() => {
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${props.LAT}&lon=${props.LON}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        // Weekly forecast
        setWeeklyForecast(response.data.list.slice(0, 100));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.LAT, props.LON]);

  // Compare current temperature to minimum and maximum temperature

  useEffect(() => {
    if (
      temperature >= wheat.minMaxTemperature[0] &&
      temperature <= wheat.minMaxTemperature[1]
    ) {
      setWheatMinMaxTemperature(true);
    } else {
      setWheatMinMaxTemperature(false);
    }
  }, [temperature]);

  // compare current tempreture to ideal tempreture

  useEffect(() => {
    if (
      temperature >= wheat.idealTemperature[0] &&
      temperature <= wheat.idealTemperature[1]
    ) {
      setWheatIdealTemperature(true);
    } else {
      setWheatIdealTemperature(false);
    }
  }, [temperature]);

  // Compare current humidity to ideal

  useEffect(() => {
    if (
      humidity >= wheat.idealHumidity[0] &&
      humidity <= wheat.idealHumidity[1]
    ) {
      setWheatIdealHumidity(true);
    } else {
      setWheatIdealHumidity(false);
    }
  }, [humidity]);

  // Compare Weekly to ideal wheat temperature
  useEffect(() => {
    Promise.all(
      weeklyForecast.map(
        (day) =>
          day.main.temp >= wheat.idealTemperature[0] &&
          day.main.temp <= wheat.idealTemperature[1]
      )
    )
      .then((result) => {
        const temperatureInRange = result.every((value) => value);
        console.log(temperatureInRange);
        if (temperatureInRange) {
          setWheatIdealTemperatureWeekly(true);
        } else {
          setWheatIdealTemperatureWeekly(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [weeklyForecast, wheat]);

  useEffect(() => {
    Promise.all(
      weeklyForecast.map(
        (day) =>
          day.main.humidity >= wheat.idealHumidity[0] &&
          day.main.humidity <= wheat.idealHumidity[1]
      )
    )
      //  test the variable day.main.humidity

      .then((result) => {
        const humidityInRange = result.every((value) => value);
        console.log(humidityInRange);
        if (humidityInRange) {
          setWheatIdealHumidityWeekly(true);
        } else {
          setWheatIdealHumidityWeekly(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [weeklyForecast, wheat]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col space-y-2 bg-gray-100 p-2 rounded-md shadow-lg">
      <div className="w-auto p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold dark:text-white">
              🌾{cityName}🌾
            </h1>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="dark:text-white">
              Current temperature is: {temperature}°C
            </p>
            <p className="dark:text-white">Current humidity is: {humidity}%</p>
            <p className="dark:text-white">
              Current wind speed is: {windSpeed} m/s
            </p>
            {/* <p>Max temperature: {maxTemp}°C</p>
        <p>Min temperature: {minTemp}°C</p> */}
          </div>

          {wheatMinMaxTemperature ? (
            <></>
          ) : (
            <div
              className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4"
              role="alert"
            >
              <p className="font-bold">Alert</p>
              <p>Temperature is outside the safety zone.</p>
              <p>Current temperature is: {temperature}°C</p>
              <p>
                Safety zone temperature is between: {wheat.minMaxTemperature[0]}
                °C - {wheat.minMaxTemperature[1]}°C
              </p>
            </div>
          )}
          {wheatIdealTemperature ? (
            <div
              className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4"
              role="alert"
            >
              <p className="font-bold">Ideal</p>
              <p>Temperature is ideal for wheat growth.</p>
            </div>
          ) : (
            <div
              className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4"
              role="alert"
            >
              <p className="font-bold">Warning</p>
              <p>Temperature is not ideal for wheat growth</p>
              <p>Current temperature is: {temperature}°C</p>
              <p>
                Ideal temperature is between: {wheat.idealTemperature[0]}°C -{" "}
                {wheat.idealTemperature[1]}°C
              </p>
            </div>
          )}

          {wheatIdealHumidity ? (
            <div
              className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4"
              role="alert"
            >
              <p className="font-bold">Ideal</p>
              <p>Humidity is ideal for wheat growth.</p>
            </div>
          ) : (
            <div
              className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4"
              role="alert"
            >
              <p class="font-bold">Warning</p>
              <p>Humidity is not Ideal for Wheat growth.</p>
              <p>Current humidity is: {humidity}%</p>
              <p>
                Ideal humidity is between: {wheat.idealHumidity[0]}% -{" "}
                {wheat.idealHumidity[1]}%
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="font-bold text-lg">Weekly forecast:</p>
      {weeklyForecast.map((day, index) => {
        const date = new Date(day.dt * 1000);
        const weekday = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][date.getDay()];
        return (
          <div
            key={index}
            className="w-auto p-4 m-auto bg-white shadow-lg rounded-2xl dark:bg-gray-800"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="dark:text-white">Date: {day.dt_txt}</p>
              <p className="text-xl font-semibold mb-2 dark:text-white">
                {weekday}
              </p>
              <p className="text-3xl font-bold mb-2 dark:text-white">
                {day.main.temp}°C
              </p>
              <div className="flex items-center mb-2">
                <img
                  className="w-8 h-8 mr-2"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="Weather icon"
                />
                <p className="text-lg font-medium dark:text-white">
                  {day.weather[0].description}
                </p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium dark:text-white">
                  Humidity: {day.main.humidity}%
                </p>
                <p className="text-sm font-medium dark:text-white">
                  Wind: {day.wind.speed} m/s
                </p>
              </div>
            </div>

            {wheatIdealTemperatureWeekly ? (
              <div
                className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4"
                role="alert"
              >
                <p className="font-bold ">Ideal</p>
                <p>Temperature is ideal for wheat growth.</p>
              </div>
            ) : (
              <div
                className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4"
                role="alert"
              >
                <p class="font-bold">Warning Weekly</p>
                <p>Temperature is not Ideal for Wheat growth</p>
                <p>Current temperature is: {day.main.temp}°C</p>
                <p>
                  Ideal temperature is between: {wheat.idealTemperature[0]}°C -{" "}
                  {wheat.idealTemperature[1]}°C
                </p>
              </div>
            )}

            {wheatIdealHumidityWeekly ? (
              <div
                className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4"
                role="alert"
              >
                <p className="font-bold">Ideal</p>
                <p>Humidity is ideal for wheat growth.</p>
              </div>
            ) : (
              <div
                className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4"
                role="alert"
              >
                <p className="font-bold">Warning Weekly</p>
                <p>Humidity is not Ideal for Wheat growth.</p>
                <p>Current humidity is: {day.main.humidity}%</p>
                <p>
                  Ideal humidity is between: {wheat.idealHumidity[0]}% -{" "}
                  {wheat.idealHumidity[1]}%
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ApiCall;
