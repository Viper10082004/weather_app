import { useState, useEffect } from 'react';
import './App.css';
import Header from "./components/Header";
import Main from './components/Main';
import Footer from './components/Footer';
import ScrollReveal from "scrollreveal";


function App() {
  const [data, setData] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(() => {
    const storedDetails = localStorage.getItem("details");
    return storedDetails ? JSON.parse(storedDetails) : {};
  });

  useEffect(() => {
    ScrollReveal().reveal(".info", {
      origin: "bottom",
      distance: "50px",
      duration: 1500,
      easing: "ease-in-out",
      reset: false,
    });
  
    ScrollReveal().reveal(".ad", {
      origin: "bottom",
      distance: "50px",
      duration: 1500,
      easing: "ease-in-out",
      reset: false,
    });
  
    ScrollReveal().reveal(".header", {
      origin: "top",
      distance: "50px",
      duration: 1500,
      easing: "ease-in-out",
      reset: false,
    });
  }, []);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    if (!searchQuery.trim()) return; // Don't do anything if the search field is empty

    // Fetch coordinates using LocationIQ API
    const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${searchQuery}&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const locationData = data[0];
        if (locationData) {
          setLatitude(locationData.lat);
          setLongitude(locationData.lon);
          setLocation(locationData.display_name); // Update location info
        }
      })
      .catch((error) => console.error("Error fetching location:", error));
  };

  // Store details in localStorage whenever it changes
  useEffect(() => {
    if (details) {
      localStorage.setItem("details", JSON.stringify(details));
    }
  }, [details]);

  function handleClick(index) {
    let day = data?.daily?.time[index];
    let weather = data?.daily?.weather_code[index];
    let windSpeed = data?.daily?.wind_speed_10m_max[index];
    let temprature = data?.daily?.temperature_2m_max[index];
    let windDirection = data?.daily?.wind_direction_10m_dominant[index];
    let precipitation = data?.daily?.precipitation_sum[index];
    let rain = data?.daily?.rain_sum[index];

    setDetails({
      day,
      weather,
      windSpeed,
      temprature,
      windDirection,
      precipitation,
      rain,
      latitude,
      longitude
    });
  }

  const API_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle (light)",
    53: "Drizzle (moderate)",
    55: "Drizzle (dense)",
    61: "Rain (light)",
    63: "Rain (moderate)",
    65: "Rain (heavy)",
    73: "Rain (heavy)",
    80: "Rain showers (light)",
    81: "Rain showers (moderate)",
    82: "Rain showers (violent)",
    85: "Rain showers (violent)",
    95: "Thunderstorm (light moderate)",
    96: "Thunderstorm with hail (light)",
    99: "Thunderstorm with hail (heavy)"
  };

  function getWeatherDescription(code) {
    return weatherDescriptions[code] || "Unknown weather";
  }

  function getAbbreviatedDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  }

  function getDay(dateTimeString) {
    const dateObject = new Date(dateTimeString);
    return dateObject.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Get User's Location
  useEffect(() => {
    // Check if details already exist in localStorage
    const storedDetails = localStorage.getItem("details");
    const parsedDetails = storedDetails ? JSON.parse(storedDetails) : {};

    if (parsedDetails && parsedDetails.latitude && parsedDetails.longitude) {
      setLatitude(parsedDetails.latitude);
      setLongitude(parsedDetails.longitude);
    } else {
      // If no details found in localStorage, get geolocation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setDetails({
              ...details,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    }
  }, []);

  // Fetch Weather Data
  useEffect(() => {
    if (latitude && longitude) {
      setLoading(true); // Start loading before fetching
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&hourly=temperature_2m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm,vapour_pressure_deficit,et0_fao_evapotranspiration,evapotranspiration,visibility,cloud_cover_high,cloud_cover_mid,cloud_cover_low,cloud_cover,surface_pressure,pressure_msl,weather_code,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,temperature_180m,temperature_120m,temperature_80m,wind_gusts_10m,wind_direction_180m,wind_direction_120m,wind_direction_80m,wind_direction_10m,wind_speed_120m,wind_speed_80m,wind_speed_10m,wind_speed_180m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }
          return response.json();
        })
        .then(data => {
          setData(data);
          setLoading(false); // Stop loading after fetching data

          // Only set details in localStorage if not already present
          if (!localStorage.getItem("details")) {
            let day = data?.current?.time;
            let weather = data?.current?.weather_code;
            let windSpeed = data?.current?.wind_speed_10m;
            let temprature = data?.current?.temperature_2m;
            let windDirection = data?.current?.wind_direction_10m;
            let precipitation = data?.current?.precipitation;
            let rain = data?.current?.rain;

            setDetails({
              day,
              weather,
              windSpeed,
              temprature,
              windDirection,
              precipitation,
              rain,
              latitude,
              longitude
            });
          }
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          setLoading(false);
        });
    }
  }, [latitude, longitude]);

  // Fetch Location Data
  useEffect(() => {
    if (latitude && longitude) {
      const url = `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          setLocation(data.address.city || data.address.town || data.address.village || "Unknown location");
        })
        .catch(error => console.error("Error fetching location:", error));
    }
  }, [latitude, longitude]);

  return (
    <div className="container">
      <Header
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />

      <Main 
        details={details}
        location={location}
        data={data}
        loading={loading}
        getAbbreviatedDayName={getAbbreviatedDayName}
        getWeatherDescription={getWeatherDescription}
        handleClick={handleClick}
      />
      <Footer />
    </div>
  );
}

export default App;
