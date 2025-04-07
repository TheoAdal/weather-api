import express from "express";
import pool from "./config.js";

const router = express.Router();

//list all locations
router.get("/locations", async (req, res) => {
  const [locations] = await pool.query("SELECT * FROM locations ORDER BY name");
  res.json(locations);
});

//latest forecast of all locations for every day
router.get("/forecasts/latest", async (req, res) => {
  try {
    await pool.query("SET time_zone = '+00:00'");

    const query = `
      SELECT 
        f.id,
        f.location_id,
        DATE_FORMAT(f.date, '%Y-%m-%d') as date,
        f.temperature,
        f.humidity,
        f.wind_speed,
        f.created_at,
        l.name as location_name
      FROM forecasts f
      JOIN (
        SELECT 
          location_id, 
          DATE(date) as forecast_date,
          MAX(created_at) as latest_created         -- important line
        FROM forecasts
        GROUP BY location_id, DATE(date)
      ) latest ON f.location_id = latest.location_id 
              AND DATE(f.date) = latest.forecast_date
              AND f.created_at = latest.latest_created
      JOIN locations l ON f.location_id = l.id
      ORDER BY l.name, f.date
    `;

    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch latest forecasts" });
  }
});

//average of last 3 forecasts per location
router.get("/forecasts/average", async (req, res) => {
  try {
    await pool.query("SET time_zone = '+00:00'");

    const query = `
      WITH ranked_forecasts AS (
        SELECT 
          f.id,
          f.location_id,
          f.temperature,
          f.date,
          l.name,
          ROW_NUMBER() OVER (
            PARTITION BY l.id, DATE(f.date) 
            ORDER BY f.created_at DESC
          ) as forecast_rank
        FROM forecasts f
        JOIN locations l ON f.location_id = l.id
      )
      SELECT 
        location_id as id,
        name,
        DATE_FORMAT(date, '%Y-%m-%d') as date,
        ROUND(AVG(temperature), 1) as avg_temperature,
        COUNT(*) as data_entries
      FROM ranked_forecasts
      WHERE forecast_rank <= 3  -- Only include last 3 forecasts per day
      GROUP BY 
        location_id, 
        name, 
        DATE_FORMAT(date, '%Y-%m-%d'),
        DATE(date)
      ORDER BY 
        name, 
        DATE(date)
    `;

    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching averages:", error);
    res.status(500).json({
      error: "Failed to fetch averages",
      details: error.message,
    });
  }
});

//fetch top N locations by metric (temperature, humidity or wind speed in our case)
router.get("/locations/top", async (req, res) => {
  const { metric = "temperature", n = 3 } = req.query;

  //validation
  if (isNaN(n) || n < 1) {
    return res
      .status(400)
      .json({ error: "Parameter 'n' must be a positive number" });
  }

  //ONLY temperature, humidity and wind speed are stored in db
  const validMetrics = ["temperature", "humidity", "wind_speed"];
  if (!validMetrics.includes(metric)) {
    return res.status(400).json({
      error: "Invalid metric. Only 'temperature' is available",
    });
  }

  try {
    const query = `
      SELECT 
        l.id,
        l.name,
        ${
          metric === "temperature"
            ? "ROUND(AVG(f.temperature), 1)"
            : metric === "humidity"
            ? "ROUND(AVG(f.humidity), 1)"
            : "ROUND(AVG(f.wind_speed), 1)"
        } as avg_rounded_metric_value   
      FROM locations l
      JOIN forecasts f ON l.id = f.location_id
      GROUP BY l.id
      ORDER BY avg_rounded_metric_value ${
        metric === "wind_speed" ? "DESC" : "DESC"
      }
      LIMIT ?
    `;

    const [results] = await pool.query(query, [parseInt(n)]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching top locations:", error);
    res.status(500).json({ error: "Failed to fetch top locations" });
  }
});

export default router;
