import { useState, useEffect } from "react";
import axios from "./axios";

export default function Weather({ selected }) {
    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const date = new Date().toLocaleString("en-us", {
        month: "short",
        day: "numeric",
    });
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const [weather, setWeather] = useState(null);
    useEffect(() => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${selected.lat}&lon=${selected.lng}&exclude=hourly,minutely&appid=ec3e7aaed207a3f2e54d02f3b057b45f&units=metric`
            )
            .then(({ data }) => {
                setWeather(data);
            });
    }, []);
    if (!weather) {
        return null;
    }
    return (
        <div className="weather-container">
            <h2 className="weather-heading">Surf Forecast</h2>
            <div className="weather-center">
                <div className="curr-weather">
                    <h5>
                        {time}, {date}
                    </h5>
                    <h3>{location.city}</h3>
                    <h5>
                        {weather.current.weather[0].description.toUpperCase()}
                    </h5>
                    <h2>{Math.round(weather.current.temp)}°C</h2>
                    <img
                        className="curr-weather-img"
                        src={`/${weather.current.weather[0].icon}.png`}
                    />
                    <h5>
                        <i className="fas fa-wind"> </i>
                        &nbsp;{Math.round(weather.current.wind_speed)}kmh
                    </h5>
                </div>

                <div className="five-days">
                    {weather && (
                        <>
                            {weather.daily.map((day, idx) => {
                                if (idx > 0 && idx < 6) {
                                    return (
                                        <div className="curr-weather" key={idx}>
                                            <h5>
                                                {
                                                    weekdays[
                                                        new Date().getDay() +
                                                            idx
                                                    ]
                                                }
                                            </h5>
                                            <h5 className="light">
                                                {day.weather[0].description}
                                            </h5>
                                            <h3>
                                                {Math.round(day.temp.day)}°C
                                            </h3>
                                            <img
                                                className="curr-weather-img-small"
                                                src={`/${day.weather[0].icon}.png`}
                                            />
                                            <h5>
                                                <i className="fas fa-wind"> </i>
                                                &nbsp;
                                                {Math.round(day.wind_speed)}
                                                kmh
                                            </h5>
                                        </div>
                                    );
                                }
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
