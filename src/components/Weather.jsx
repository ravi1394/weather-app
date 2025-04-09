import React, { useEffect, useRef, useState } from 'react';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import search_icon from '../assets/search.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

import './Weather.css';

const Weather = () => {
    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isDark, setIsDark] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const updateRecentSearches = (city) => {
        setRecentSearches(prev => {
            const updated = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())];
            return updated.slice(0, 5);
        });
    };

    const search = async (city) => {
        if (city.trim() === "") {
            alert("Please enter a city name");
            return;
        }

        setLoading(true);
        setErrorMsg('');
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.message || 'City not found');
                setWeatherData(null);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
            
            updateRecentSearches(data.name);
        } catch (error) {
            setErrorMsg('Failed to fetch weather data');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search("");
    }, []);

    return (
        <div className={`weather ${isDark ? 'dark' : 'light'}`}>
            <div className="top-bar">
                <h1 className="dashboard-title">🌤️ Weather Dashboard</h1>
                <button className="theme-toggle" onClick={() => setIsDark(prev => !prev)}>
                    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>

            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter city name"
                    onKeyDown={(e) => e.key === 'Enter' && search(inputRef.current.value)}
                />
                <img src={search_icon} alt="search" onClick={() => search(inputRef.current.value)} />
            </div>

            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <p>Recent:</p>
                    {recentSearches.map((city, idx) => (
                        <button key={idx} onClick={() => search(city)}>
                            {city}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="loader">Loading...</div>
            ) : errorMsg ? (
                <p style={{ color: 'red', marginTop: '20px' }}>{errorMsg}</p>
            ) : weatherData ? (
                <>
                    <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="humidity" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="wind" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
