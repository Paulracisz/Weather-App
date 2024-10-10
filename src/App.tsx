import './App.css'
import { useState, useEffect, useRef } from 'react';

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: Condition;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: number;
    is_sun_up: number;
  };
  hour: Hour[];
}

interface Forecast {
  forecastday: ForecastDay[];
}

interface ForecastResponse {
  location: Location;
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: Forecast;
}


function App() {
  const [responseObj, setResponseObj] = useState<ForecastResponse | null>(null);
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<string | null>(null);

  const currentHourRef = useRef<HTMLDivElement | null>(null);



  // how to import api key: import.meta.env.VITE_WEATHER_API_KEY
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (import.meta.env.VITE_DEV_MODE !== "true") {
        get7DayForecast(position.coords.latitude, position.coords.longitude);
      }
      else {
        getWeatherData();
      }
    });
  }, []);

  useEffect(() => {
    if (currentHourRef.current) {
      currentHourRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center'})
    }
  }, [responseObj, currentHour])

  function get7DayForecast(lat: number, lon: number) {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${lat},${lon}&days=7`)
      .then((response) => response.json())
      .then((json) => {
        setResponseObj(json)
        console.log("api weather data", responseObj)
        getCurrentTime()

      })
      .catch((error) => console.error("Error fetching forecast:", error))

  }

  function getWeatherData() {
    import('./weatherData.json')
      .then((data) => {
        setResponseObj(data.default);
        console.log("local weather data", data.default)
        getCurrentTime()
      })
      .catch((error) => console.error('Error loading dev weather data', error))
  }

  function getCurrentTime() {
    const now = new Date
    const currentTime = now.getHours()
    const currentDay = now.getDay()
    setCurrentHour(currentTime);
    const day = setDayName(currentDay)
    setCurrentDay(day)
  }

  function setDayName(number: number): string {
    switch (number) {
      case 0:
        return 'Sunday'
      case 1:
        return 'Monday'
      case 2:
        return 'Tuesday'
      case 3:
        return 'Wednesday'
      case 4:
        return 'Thursday'
      case 5:
        return 'Friday'
      case 6:
        return 'Saturday'
      default:
        return 'Current Day Unknown'
    }
  }

  function convertHour(epoch_time: number): string {
    const date = new Date(epoch_time);
    let hours = date.getHours();

    const amorpm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12; // using modulo operator to convert mil time to standard Ex: 13 (mil time) into 1pm
    if (hours == 0) { // since 0 is 12am, check for that case
      hours = 12
    }

    return `${hours}${amorpm}`
  }


  return (
    <>
      <h1>Weather App</h1>
      <div>

        <p>Currently</p>
        {/* Current Temperature in Farenheit */}
        <h2 className="temp">{currentHour !== null && responseObj?.forecast.forecastday[0].hour[currentHour]?.temp_f
          ? `${responseObj.forecast.forecastday[0].hour[currentHour].temp_f}°F`
          : ""}</h2>

        {/* Current Weather Condition (Ex: Sunny) */}
        <p>{currentHour !== null && responseObj?.forecast.forecastday[0].hour[currentHour]?.condition.text
          ? `${responseObj.forecast.forecastday[0].hour[currentHour].condition.text}`
          : ""}</p>

        {/* High and Low temp and Precip */}
        <p>High: {responseObj?.forecast.forecastday[0].day.maxtemp_f}° Low: {responseObj?.forecast.forecastday[0].day.mintemp_f}° Precip: {responseObj?.forecast.forecastday[0].day.daily_chance_of_rain}% </p>

        {/* Current Day and Locale */}
        <p>{currentDay} • {responseObj?.location.name || ""}</p>

        <div className="hourly-forecast-scrollable">
          <div className="hourly-forecast-container">
            {responseObj?.forecast.forecastday[0].hour.map((_hourObj: object, index: number) => (
              <div key={index} ref={currentHour === index ? currentHourRef : null} className="hourly-forecast-flex">
                <p>{responseObj?.forecast.forecastday[0].hour[index].temp_f}°</p>

                <img src={responseObj?.forecast.forecastday[0].hour[index].condition.icon} alt={responseObj?.forecast.forecastday[0].hour[index].condition.text} />

                <p>{responseObj?.forecast.forecastday[0].hour[index].chance_of_rain}%</p>

                <p>{responseObj && convertHour(responseObj?.forecast.forecastday[0].hour[index].time_epoch * 1000)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <p>
          Created using React + Typescript
          <br />
          © 2024 Paul Racisz
        </p>
      </div>
    </>
  )
}

export default App
