import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { withRouter } from "react-router";
import axios from "./axios";

export default function BarChart({ selected }) {
    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const date = new Date().toLocaleString("en-us", {
        month: "short",
        day: "numeric",
    });
    const [stormglassWeather, setStormglassWeather] = useState(null);
    const [tideExtremes, setTideExtremes] = useState(null);
    const [seaLevel, setSeaLevel] = useState(null);
    const [astronomy, setAstronomy] = useState(null);
    const params =
        "airTemperature,waterTemperature,windSpeed,windDirection,waveHeight,waveDirection,wavePeriod,swellHeight,swellDirection,swellPeriod,secondarySwellHeight,secondarySwellDirection,secondarySwellPeriod";
    const start = new Date().toISOString();
    const end = new Date(
        new Date().setDate(new Date().getDate() + 5)
    ).toISOString(); // Forecast for 5 days
    useEffect(() => {
        axios
            .get(
                `https://api.stormglass.io/v2/weather/point?lat=${selected.lat}&lng=${selected.lng}&params=${params}&start=${start}&end=${end}`,
                {
                    headers: {
                        Authorization: `${process.env.STORMGLASS_KEY}`,
                    },
                }
            )
            .then(({ data }) => {
                setStormglassWeather(data);
                console.log("Stormglass Weather: ", data);
            });
    }, []);
    useEffect(() => {
        axios
            .get(
                `https://api.stormglass.io/v2/tide/extremes/point?lat=${selected.lat}&lng=${selected.lng}&start=${start}&end=${end}`,
                {
                    headers: {
                        Authorization: `${process.env.STORMGLASS_KEY}`,
                    },
                }
            )
            .then(({ data }) => {
                setTideExtremes(data);
                console.log("Stormglass Tide: ", data);
            });
    }, []);
    useEffect(() => {
        axios
            .get(
                `https://api.stormglass.io/v2/tide/sea-level/point?lat=${selected.lat}&lng=${selected.lng}&start=${start}&end=${end}`,
                {
                    headers: {
                        Authorization: `${process.env.STORMGLASS_KEY}`,
                    },
                }
            )
            .then(({ data }) => {
                setSeaLevel(data);
                console.log("Stormglass SeaLevel: ", data);
            });
    }, []);
    useEffect(() => {
        axios
            .get(
                `https://api.stormglass.io/v2/astronomy/point?lat=${selected.lat}&lng=${selected.lng}&start=${start}&end=${end}`,
                {
                    headers: {
                        Authorization: `${process.env.STORMGLASS_KEY}`,
                    },
                }
            )
            .then(({ data }) => {
                setAstronomy(data);
                console.log("Stormglass setAstronomy: ", data);
            });
    }, []);
    if (!stormglassWeather) {
        return null;
    }
    return (
        <div className="weather-container">
            <h2 className="weather-heading">Forecast</h2>
            <div className="weather-center">
                <div className="curr-weather barchart">
                    <Bar
                        data={{
                            labels: stormglassWeather.hours.map((value) =>
                                value.time.substring(11, 16)
                            ),
                            datasets: [
                                {
                                    label: "Wave Height (in m)",
                                    data: stormglassWeather.hours.map(
                                        (value) => value.waveHeight.noaa
                                    ),
                                    backgroundColor: "#e5cf6192",
                                    borderColor: "#e5cf61",
                                    // barThickness:
                                    borderWidth: 1,
                                },
                                {
                                    label: "Wind Speed (in kmh)",
                                    data: stormglassWeather.hours.map(
                                        (value) => value.windSpeed.noaa
                                    ),
                                    backgroundColor: "#e6007f8e",
                                    borderColor: "#e6007e",
                                    // barThickness:
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        // height={400}
                        // width={600}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                            fontColor: "#e5cf61",
                                        },
                                        // gridLines: {
                                        //     color: "#e5cf61",
                                        // },
                                    },
                                ],
                                xAxes: [
                                    {
                                        ticks: {
                                            fontColor: "#e5cf61",
                                        },
                                        // gridLines: {
                                        //     color: "#e5cf61",
                                        // },
                                    },
                                ],
                            },
                            responsive: true,
                            responsiveAnimationDuration: 200,
                        }}
                        legend={{
                            labels: {
                                fontColor: "#e5cf61",
                                fontFamily: "Original Surfer",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
