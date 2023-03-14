//set up body-parser and express, and the https module
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//set up https module and body-parser
const https = require("https");
app.use(bodyParser.urlencoded({ extended: false }));

//set of dotenv module to hide apikey
require('dotenv').config(); // load environment variables from .env file
const apiKey = process.env.API_KEY;

//Use express.static() method to load CSS and image
app.use(express.static("public"));

//setup GET request to the signup page
app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.html`);
})

//To parse the data from the input of the form
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            },
        }],
    };
    const jsonData = JSON.stringify(data);
    const url = `https://us21.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
    const options = {
        method: "POST",
        auth: `sail1:${apiKey}`
    };
    // make a http request
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            //Set responses to the post request
            if (response.statusCode === 200) {
                res.sendFile(`${__dirname}/success.html`);

            } else {
                res.sendFile(`${__dirname}/failure.html`);
            }
        });
    });

    request.write(jsonData);
    request.end();
});

// To post at the /failure route so that users can try again.
app.post("/failure", function (req, res) {
    res.redirect("/");
});

//set up express server port
app.listen(port, function () {
    console.log(`Server is running at ${port}`);
})
