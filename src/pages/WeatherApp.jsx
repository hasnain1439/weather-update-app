import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CiSearch } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

function WeatherApp() {
  const [cityName, setCityName] = useState("Lahore");
  const [weatherData, setWeatherData] = useState(null);

  const validationSchema = Yup.object().shape({
    city: Yup.string(),
  });

  useEffect(() => {
    if (!cityName) return;

    let apiKey = "2d66e4c984d0701b5d0c2d497631d755";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((weaData) => {
        setWeatherData(weaData);
       
      })
      .catch((error) => console.error("Something is Wrong", error));
  }, [cityName]);
 console.log("weatherData",weatherData);
  return (
    <div className="w-full h-[100vh] relative bg-gradient-to-b from-[#8A2BE2] to-[#6A5ACD]">
      {/* Search Bar */}
      <div
        className="w-[50%] h-[30px] bg-white absolute top-2 start-[50%] flex h-[50px] items-center"
        style={{ transform: "translateX(-50%)" }}
      >
        <Formik
          initialValues={{ city: "Lahore" }}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={(values) => {
            setCityName(values.city);
          }}
        >
          <Form className="w-full">
            <div className="flex">
              <Field
                type="text"
                name="city"
                placeholder="Enter City Name"
                className="p-[10px]  text-[16px] w-[90%] bg-transparent outline-0 "
              />
              <div className="w-[10%] bg-black flex items-center justify-center">
                <button
                  type="submit"
                  className="text-white text-[30px]  py-[10px] font-bold"
                >
                  <CiSearch />
                </button>
              </div>
            </div>
            <ErrorMessage
              name="city"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </Form>
        </Formik>
      </div>

      {/* Weather Card */}
      {weatherData && weatherData.weather ? (
        <div className="flex justify-center items-center h-[100vh]">
          <div className="w-[50%] py-[30px] bg-gradient-to-b from-[#6C0BA9] mt-[5%] to-[#5B2C98] rounded-2xl p-6 shadow-lg text-center text-white flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              <IoLocationOutline className="text-[28px] font-semibold" />
              <h2 className="text-[28px]">{weatherData.name}</h2>
            </div>
            <div className="text-center flex flex-col gap-6">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].  icon}@2x.png`}
                alt="weather icon" height={120} width={120} className="mx-auto"
              />
              <h3 className="text-[20px] capitalize">
                {weatherData.weather?.[0]?.description}
              </h3>
              <h1 className="text-[64px]">{weatherData.main.temp}°C</h1>
              <h3 className="text-[18px]">
                Feels Like {Math.round(weatherData.main.feels_like)}°C
              </h3>
            </div>
            <div className="rounded-[5px] p-6 bg-[#6C0BA9] rounded-2xl shadow-lg capitalize">
              <h2>Wind speed: {weatherData.wind?.speed} m/s</h2>
            </div>
          </div>
        </div>
      ) : (
        <p
          className="p-6 absolute top-[50%] start-[50%] text-xl w-[50%] text-white text-center bg-gradient-to-b from-[#6C0BA9] to-[#5B2C98]"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          Loading weather data...
        </p>
      )}
    </div>
  );
}

export default WeatherApp;
