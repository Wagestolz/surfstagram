import ProfilePic from "./profilepic";
import BioEditer from "./bioediter";
import { useState, useEffect } from "react";
import axios from "./axios";

export default function Profile({
    first,
    last,
    profile_pic,
    bio,
    toggleUploader,
    updateBio,
}) {
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
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    useEffect(() => {
        axios
            .get(
                "https://geolocation-db.com/json/c0593a60-4159-11eb-80cd-db15f946225f"
            )
            .then(({ data }) => {
                console.log("data: ", data);
                setLocation(data);
                axios
                    .get(
                        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.latitude}&lon=${data.longitude}&exclude=hourly,minutely&appid=ec3e7aaed207a3f2e54d02f3b057b45f&units=metric`
                    )
                    .then(({ data }) => {
                        console.log("weather data: ", data);
                        setWeather(data);
                    });
            });
    }, []);

    if (!weather) {
        return null;
    }
    return (
        <>
            <div className="profile-container">
                <div className="profile-center">
                    <ProfilePic
                        first={first}
                        last={last}
                        profile_pic={profile_pic}
                        toggleUploader={toggleUploader}
                        largerSize="bigger"
                    />
                    <div className="profile-info">
                        <h3>
                            {first} {last}
                        </h3>
                        <h6>
                            {location.city}, {location.country_name}
                        </h6>
                        <BioEditer bio={bio} updateBio={updateBio} />
                    </div>
                </div>
            </div>
            <div className="weather-container">
                <h2 className="weather-heading">Weather Forecast</h2>
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
                    </div>

                    <div className="five-days">
                        {weather && (
                            <>
                                {weather.daily.map((day, idx) => {
                                    if (idx > 0 && idx < 6) {
                                        return (
                                            <div
                                                className="curr-weather"
                                                key={idx}
                                            >
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
                                            </div>
                                        );
                                    }
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
