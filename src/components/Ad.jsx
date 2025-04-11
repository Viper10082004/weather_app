        import React from "react";
        import "../App.css";
        import { LineWave } from 'react-loader-spinner';
        
        const Ad = ({data, loading, getAbbreviatedDayName, getWeatherDescription, handleClick   }) => {  return (
        
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
                  <div className="weather"><img className='weather-icon' src={`${getWeatherDescription(data.daily.weather_code[index])}.png`} width={"30px"} alt="" /></div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}} className="temperature">
                    <span style={{ fontSize: "15px"}}>{data.daily.temperature_2m_max[index]}</span>
                    <img className='tem-icon' src="temperature.png" width={"24px"} alt="" />
                    </div>
                </div>
                )
              })
              

            )
          }

          
        </div>)}

export default Ad;