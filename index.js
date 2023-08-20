import express from "express";
import axios from "axios";
import "dotenv/config";
import dayjs from "dayjs";

const app = express();
const port = 3000;

app.use(express.static("public"));

const GEOCODING_ENDPOINT = "http://api.openweathermap.org/geo/1.0/direct";
const OPENWEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather", async (req, res) => {
  try {
    const cityName = req.query.city || "Kuala Lumpur"; // Default to Kuala Lumpur

    // Get coordinates using Direct Geocoding API
    const geocodingResponse = await axios.get(GEOCODING_ENDPOINT, {
      params: {
        q: cityName,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });
    // console.log(geocodingResponse.data);

    const { lat, lon } = geocodingResponse.data[0];
    // It's equivalent to doing:
    // const lat = geocodingResponse.data[0].lat;
    // const lon = geocodingResponse.data[0].lon;

    const response = await axios.get(OPENWEATHER_ENDPOINT, {
      params: {
        lat: lat,
        lon: lon,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    });

    // res.json(response.data);
    // console.log(response.data);
    const weatherType = response.data.weather[0].main;
    const locationName = response.data.name;
    const temperature = Math.round(response.data.main.temp);
    const iconName = response.data.weather[0].icon;
    
    const currentTime = dayjs().format("dddd h:mm A"); // e.g., "Wednesday 2:00 AM"

    // console.log(weatherType);

    res.render("index.ejs", {
      weatherType: weatherType,
      locationName: locationName,
      temperature: temperature,
      time: currentTime,
      iconName: iconName,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).send("Failed to retrieve weather data.");
    console.error("Error fetching weather data:", error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
