import { useState, useEffect } from 'react';
import './App.css';
import { LineWave } from 'react-loader-spinner';
import { parseISO, getDate, getMonth, getYear, getHours, getMinutes } from 'date-fns';

function App() {
  const [data, setData] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [location, setLocation] = useState(""); 
  const [loading, setLoading] = useState(true); 

  const [details, setDetails] = useState(() => {
    const storedDetails = localStorage.getItem("details");
    return storedDetails ? JSON.parse(storedDetails) : {  };
  });

  // Store details in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("details", JSON.stringify(details));
    console.log(details);
  }, [details]);

  function handleClick (index) {
    //console.log(index);
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
      rain
    });
    //setDetails([ day= day, weather= weather, WindSpeed= WindSpeed, temprature= temprature, windDirection= windDirection, precipitation= precipitation, rain= rain])

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
    55: "Drizzle (dense)", //here we stop
    61: "Rain (light)",
    63: "Rain (moderate)",
    65: "Rain (heavy)",
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
    const abbreviatedDayName = date.toLocaleDateString('en-US', options);
    //console.log(abbreviatedDayName); // Outputs: "Wed"
    return abbreviatedDayName;
  }

  function getDay(dateTimeString) {
    const dateString = dateTimeString;
    const dateObject = new Date(dateString);
    const dayName = dateObject.toLocaleDateString('en-US', { weekday: 'long' });
    return(dayName); // Outputs: "Wednesday"
  }



  // Get User's Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => console.error("Geolocation error:", error)
      );
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
          getDay(data.current.time);
          if (!localStorage.getItem("data")) {
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
              rain
            });
          }
          getAbbreviatedDayName(data.current.time);


        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          setLoading(false);
        });
    }
  }, [latitude, longitude]);
  console.log(data)

  //console.log(details);
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
      <header className='header'>
        <div className="logo">Weather.App</div>
        <div className='search_field'>
          <input type="text" placeholder='Other Cities' />
          <img src="search.png" width={"25px"} alt="" />
        </div>
      </header>

      <main>
        <div className="info">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <LineWave 
                visible={true}
                height="100"
                width="100"
                color="#3498db"
                ariaLabel="line-wave-loading"
              />
            </div>
          ) : (

            <>
              <p className='city'>
          {getAbbreviatedDayName (details.day)} | {location} {details.temprature}{data?.current_units?.temperature_2m}  
              </p>

              <div className="details">
                <div className="elements">
                  <p>Weather</p>
                  <p>{getWeatherDescription(details.weather)}</p>
                </div>

                <div className="elements">
                  <p>Wind Speed</p>
                  <p>{details.windSpeed}{data?.current_units?.wind_speed_10m}</p>
                </div>

                <div className="elements">
                  <p>Temperature</p>
                  <p>{details.temprature}{data?.current_units?.temperature_2m}</p>
                </div>

                <div className="elements">
                  <p>Wind Direction</p>
                  <p>{details.windDirection}{data?.current_units?.wind_direction_10m}</p>
                </div>

                <div className="elements">
                  <p>Rain</p>
                  <p>{details.rain}{data?.current_units?.rain}</p>
                </div>

                <div className="elements">
                  <p>Precipitation</p>
                  <p>{details.precipitation}{data?.current_units?.precipitation}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className='ad'>
          
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <LineWave 
                visible={true}
                height="100"
                width="100"
                color="#3498db"
                ariaLabel="line-wave-loading"
                />
            </div>
            ):(
              data.daily.time.map((dateString, index) =>{
                return (
                  <div  key={dateString} className='daily-data' onClick={(e)=> {handleClick(index)}}>
                  <div className="day">{getAbbreviatedDayName(dateString)}</div>
                  <div className="weather"><img src={`${getWeatherDescription(data.daily.weather_code[index])}.png`} width={"30px"} alt="" /></div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}} className="temperature">
                    <span style={{ fontSize: "15px"}}>{data.daily.temperature_2m_max[index]}</span>
                    <img src="temperature.png" width={"24px"} alt="" />
                    </div>
                </div>
                )
              })
              

            )
          }

          
        </div>
      </main>

      <footer>
        Copyright
      </footer>
    </div>
  );
}

export default App;
