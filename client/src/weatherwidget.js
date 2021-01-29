import { useState, useEffect } from "react";
import axios from "./axios";

export default function WeatherWidget({ myBeaches }) {
    // const time = new Date().toLocaleTimeString([], {
    //     hour: "2-digit",
    //     minute: "2-digit",
    // });
    // const date = new Date().toLocaleString("en-us", {
    //     month: "short",
    //     day: "numeric",
    // });
    const [weather, setWeather] = useState([]);
    console.log("myBeaches: ", myBeaches);

    async function processBeaches(Beaches) {
        for (const beach of Beaches) {
            const { data } = await axios.get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${beach.lat}&lon=${beach.lng}&exclude=hourly,minutely&appid=${process.env.OWM_KEY}&units=metric`
            );
            console.log("Data: ", data);
            setWeather((currentWeather) => {
                return [...currentWeather, data];
            });
            console.log("Done!");
        }
    }
    useEffect(() => processBeaches(myBeaches), [myBeaches]);

    if (!weather || !myBeaches) {
        return null;
    }
    return (
        <div className="weather-widget-container">
            {weather &&
                weather.map((beach) => (
                    <div key={beach.lat}>
                        {/* <h2 className="single-weather-heading">
                            {myBeaches[idx].name}
                        </h2> */}
                        <div className="single-weather">
                            <div className="single-weather-img-container">
                                <img
                                    className="single-weather-img"
                                    src={`/${beach.current.weather[0].icon}.png`}
                                />
                                <h5>
                                    <i className="fas fa-wind"> </i>
                                    &nbsp;{Math.round(beach.current.wind_speed)}
                                    kmh
                                </h5>
                            </div>
                            <div className="single-weather-info">
                                <h5>
                                    {beach.current.weather[0].description.toUpperCase()}
                                </h5>
                                <h2>{Math.round(beach.current.temp)}°C</h2>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}
