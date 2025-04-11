import React from "react";
import "../App.css";
import Info from "./Info";
import Ad from './Ad';
        
        const Main = ({data, loading, getAbbreviatedDayName, getWeatherDescription, handleClick, details, location }) => {  return (
        <main>
            <Info 
                details={details}
                location={location}
                data={data}
                loading={loading}
                getAbbreviatedDayName={getAbbreviatedDayName}
                getWeatherDescription={getWeatherDescription}
            />

            <Ad 
                data={data}
                loading={loading}
                getAbbreviatedDayName={getAbbreviatedDayName}
                getWeatherDescription={getWeatherDescription}
                handleClick={handleClick}
            />
        </main>
        )}

        export default Main;
