const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
var body_parser = require('body-parser');
var multer = require('multer');
var form = multer();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true })); 
app.use(form.array()); 

// Routes
const root = require('./routes/root');
const market = require('./routes/market');
const search = require('./routes/search');
const warframe_api_data = require('./routes/warframe-data');

app.use('/', root);
app.use('/market', market);
app.use('/search', search)
app.use('/warframe-data', warframe_api_data);

// Writes API Data to File
function pull_api_data() {

    axios.get('http://0.0.0.0:3000/warframe-data')
        .then(warframe_api_data => {

            fs.writeFile(path.resolve(__dirname, 'database/warframe-api-data.json'), JSON.stringify(warframe_api_data.data), (err) => {

                if (err) {

                    console.log(err);

                }

            });

        })
        .catch(err => {

            console.log(err);

        });

    setInterval(() => {

        axios.get('http://0.0.0.0:3000/warframe-data')
            .then(warframe_api_data => {

                fs.writeFile(path.resolve(__dirname, 'database/warframe-api-data.json'), JSON.stringify(warframe_api_data.data), (err) => {

                    if (err) {

                        console.log(err);

                    }

                });

            })
            .catch(err => {

                console.log(err);

            });

    }, 60000);

}

// Start Server
const port = 3000;
app.listen(port, () => {

    console.log(`Example app listening on port ${port}`);

    // Starts API pulling
    pull_api_data();

});
