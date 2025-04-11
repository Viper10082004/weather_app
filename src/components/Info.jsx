import React from "react";
import "../App.css";
import { LineWave } from 'react-loader-spinner';

const Info = ({ details, location, data, loading, getAbbreviatedDayName, getWeatherDescription }) => {  return (
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
  );
};

export default Info;
