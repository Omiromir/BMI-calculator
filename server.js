const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/calculate-bmi", (req, res) => {
  const { weight, height } = req.body;

  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <link rel="stylesheet" href="/css/style.css">
            </head>
            <body>
                <div class="container__result">
                    <div class="result__content">
                        <h1>Invalid Input</h1>
                        <p>Please provide valid positive numbers for weight and height.</p>
                        <a href="/" class="bmi__btn">Go Back</a>
                    </div>
                </div>
            </body>
            </html>
        `);
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obese";

   const {color, message} = colorCategory(category);

  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BMI Result</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div class="container__result">
                <div class="result__content">
                    <h1>Your BMI Result:</h1>
                    <p class="bmi__result" style="color:${color};">${bmi.toFixed(
                      2
                    )}</p>
                    <p class="bmi__category">${message}</p>
                    <a href="/" class="bmi__btn">Go Back</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const colorCategory = function(category) {
    let categoryInfo = {};

    switch (category) {
        case "Underweight":
            categoryInfo.color = "blue";
            categoryInfo.message = " go to the gym, lightweight";
            break;
        case "Normal":
            categoryInfo.color = "green";
            categoryInfo.message = "Normal, but still need to go to the gym";
            break;
        case "Overweight":
            categoryInfo.color = "yellow";
            categoryInfo.message = "Overweight, Go do some cardio";
            break;
        case "Obese":
            categoryInfo.color = "red";
            categoryInfo.message = "Omg that is obese, Go walk around";
            break;
        default:
            categoryInfo.color = "gray";
            categoryInfo.message = "Unknown category.";
            break;
    }

    return categoryInfo;
};

