import axios from "axios";
import pool from "./config.js";
import dotenv from "dotenv";

dotenv.config();

const LOCATIONS = [
  { name: "Rome", lat: 41.9028, lon: 12.4964 },
  { name: "Porto", lat: 41.1579, lon: -8.6291 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
];

const BASE_URL = "https://api.meteomatics.com";

function parseAPIDate(dateString) {
  // Meteomatics returns dates like "2025-04-04T00:00:00+00:00"
  const date = new Date(dateString.replace("+00:00", "Z"));
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

async function fetchWeather() {
  // Set MySQL session to UTC timezone
  await pool.query("SET time_zone = '+00:00'");

  const username = process.env.API_USERNAME;
  const password = process.env.API_PASSWORD;

  // Fixed 7-day UTC range (April 4-10, 2025)
  const startDate = "2025-04-04T00:00:00Z";
  const endDate = "2025-04-10T00:00:00Z";
  const dateRange = `${startDate}--${endDate}:P1D`;

  const params = "t_2m:C,relative_humidity_2m:p,wind_speed_10m:ms";

  try {
    for (const city of LOCATIONS) {
      try {
        // Get or create location
        const [location] = await pool.query(
          "INSERT INTO locations (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
          [city.name]
        );
        const locationId = location.insertId;

        // Fetch weather data
        const response = await axios.get(
          `${BASE_URL}/${dateRange}/${params}/${city.lat},${city.lon}/json`,
          {
            auth: { username, password },
            timeout: 10000,
          }
        );

        // Process metrics
        const metrics = {
          temperature: response.data.data.find((d) => d.parameter === "t_2m:C"),
          humidity: response.data.data.find(
            (d) => d.parameter === "relative_humidity_2m:p"
          ),
          wind_speed: response.data.data.find(
            (d) => d.parameter === "wind_speed_10m:ms"
          ),
        };

        // Combine data by date
        const forecasts = [];
        for (
          let i = 0;
          i < metrics.temperature.coordinates[0].dates.length;
          i++
        ) {
          try {
            const date = parseAPIDate(
              metrics.temperature.coordinates[0].dates[i].date
            );
            forecasts.push([
              locationId,
              date,
              metrics.temperature.coordinates[0].dates[i].value,
              metrics.humidity.coordinates[0].dates[i].value,
              metrics.wind_speed.coordinates[0].dates[i].value,
            ]);
          } catch (dateError) {
            console.error(
              `⚠️ Invalid date format for ${city.name}:`,
              dateError.message
            );
            continue;
          }
        }

        // Batch insert
        await pool.query(
          `INSERT INTO forecasts 
           (location_id, date, temperature, humidity, wind_speed) 
           VALUES ?`,
          [forecasts]
        );

        console.log(
          `✅ Successfully processed ${city.name} (${forecasts.length} records)`
        );
      } catch (cityError) {
        console.error(`❌ Failed to process ${city.name}:`, cityError.message);
      }
    }
  } catch (error) {
    console.error("💥 Critical error:", error.message);
  } finally {
    pool.end();
    console.log("🏁 Data fetch process completed");
  }
}

fetchWeather();
