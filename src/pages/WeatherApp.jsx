import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CiSearch } from "react-icons/ci";
import { IoLocationOutline, IoWaterOutline } from "react-icons/io5";
import { FiWind } from "react-icons/fi";
import { WiBarometer } from "react-icons/wi";

// Helper to format date
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString("en-US", options);
};

function WeatherApp() {
  const [cityName, setCityName] = useState("Lahore");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    city: Yup.string().required("City name is required"),
  });

  useEffect(() => {
    const fetchWeather = async () => {
      if (!cityName) return;
      
      setLoading(true);
      setError(null);
      
      const apiKey = "2d66e4c984d0701b5d0c2d497631d755"; 
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error("City not found");
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 font-sans text-white">
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
        
        {/* Decorative Circles behind the glass */}
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-50px] left-[20%] w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Search Bar */}
        <div className="relative z-10 mb-8">
          <Formik
            initialValues={{ city: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              setCityName(values.city);
              resetForm();
            }}
          >
            {({ errors, touched }) => (
              <Form className="w-full">
                <div className="relative flex items-center bg-white/20 rounded-full px-4 py-2 border border-white/30 shadow-sm transition-all focus-within:bg-white/30 focus-within:border-white/50">
                  <IoLocationOutline className="text-white text-xl mr-2" />
                  <Field
                    type="text"
                    name="city"
                    placeholder="Search city..."
                    className="bg-transparent border-none outline-none text-white placeholder-gray-300 w-full font-medium"
                    autoComplete="off"
                  />
                  <button type="submit" className="text-white hover:text-yellow-300 transition-colors">
                    <CiSearch size={24} />
                  </button>
                </div>
                {errors.city && touched.city && (
                  <div className="text-red-300 text-xs ml-4 mt-1">{errors.city}</div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        {/* Content Area */}
        <div className="relative z-10 min-h-[300px] flex flex-col justify-center">
          
          {loading ? (
            <div className="text-center animate-pulse">
              <p className="text-xl font-light">Checking the sky...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-300 text-lg mb-2">Oops!</p>
              <p>{error}</p>
            </div>
          ) : weatherData ? (
            <>
              {/* Main Weather Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-wide">{weatherData.name}, {weatherData.sys.country}</h2>
                <p className="text-sm text-gray-300 mt-1">{formatDate(new Date())}</p>
                
                <div className="flex flex-col items-center justify-center mt-6">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                    alt="weather icon"
                    className="w-32 h-32 drop-shadow-lg"
                  />
                  <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    {Math.round(weatherData.main.temp)}°
                  </h1>
                  <p className="text-xl font-medium capitalize mt-2 text-gray-200">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                
                {/* Wind */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <FiWind className="text-2xl mb-1 text-blue-300" />
                  <span className="text-sm font-light text-gray-300">Wind</span>
                  <span className="font-semibold">{weatherData.wind.speed} m/s</span>
                </div>

                {/* Humidity */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <IoWaterOutline className="text-2xl mb-1 text-blue-300" />
                  <span className="text-sm font-light text-gray-300">Humidity</span>
                  <span className="font-semibold">{weatherData.main.humidity}%</span>
                </div>

                {/* Pressure */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <WiBarometer className="text-2xl mb-1 text-blue-300" />
                  <span className="text-sm font-light text-gray-300">Pressure</span>
                  <span className="font-semibold">{weatherData.main.pressure} hPa</span>
                </div>

              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;