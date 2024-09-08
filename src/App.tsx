import './App.css'
import { useState, useEffect } from 'react';

interface Location {
  name: string;
  region: string;
}

interface ForecastResponse {
  location: Location;
  forecast: object;
  forecastday: Array;
  // Add more fields as needed from the forecast API response
}

function App() {
  const [responseObj, setResponseObj] = useState<ForecastResponse | null>(null);


  // how to import api key: import.meta.env.VITE_WEATHER_API_KEY
  useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    get7DayForecast(position.coords.latitude, position.coords.longitude);
  });
}, []);

function get7DayForecast(lat: number, lon: number) {
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}&days=7`)
  .then((response) => response.json())
  .then((json) => { 
    setResponseObj(json)
    console.log(responseObj)

  })
  .catch((error) => console.error("Error fetching forecast:", error))

}


  return (
    <>
      <h1>Weather App</h1>
      <div>
        <h2>Forecast for { responseObj?.location.name || ""}, { responseObj?.location.region || "" }</h2>
        <p>{ responseObj?.forecast.forecastday.hour[0].temp_f || ""}</p>
      </div>
      <div className="card">
        <p>
        Created using React + Typescript
        <br/>
        © 2024 Paul Racisz 
        </p>
      </div>
    </>
  )
}

export default App
