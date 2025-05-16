// https://www.openuv.io/dashboard?tab=0
// ^^ link to the API

import express from "express";
import axios from "axios";
import 'dotenv/config';
const app = express();
const port = 3000;

const apiKey = "openuv-4bsirmaobaubs-io";

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  try {
    //const result = await axios.get(URL);

    const latitude = 43.65; // TORONTO
    const longitude = -79.38;
    const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`, {
      headers: { 'x-access-token': process.env.apiKey }
    });

    const uv = response.data.result.uv;
    let message;

    if (uv < 3) {
      message = "Low UV - No Sunscreen needed.";
    } else if (uv < 6) {
      message = "Moderate UV - Consider sunscreen";
    } else if (uv < 8) {
      message = "High UV - Sunscreen recomended.";
    } else {
      message = "Very High UV - Sunscreen essential!";
    }

    res.render("index.ejs", { 
      uv: uv, 
      message: message,
    });
  } catch (error) {
    console.error(error);
    res.render('index', { uv: null, message: 'Unable to fetch UV index.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});