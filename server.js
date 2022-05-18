const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Routes
const root = require('./routes/root');
const warframe_api_data = require('./routes/warframe-data');

app.use('/', root);
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

    setTimeout(() => {

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
