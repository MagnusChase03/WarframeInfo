const express = require('express');
const axios = require('axios');
const router = express.Router();

// Routes
router.get('/', (req, res) => {

    // Get API Data
    axios.get('https://api.warframestat.us/pc')
        .then(warframe => {

            // Get Market Data
            axios.get('https://api.warframe.market/v1/items')
                .then(market => {

                    let warframe_api_data = [];
                    warframe_api_data.push(warframe.data);
                    warframe_api_data.push(market.data);
                    res.send(warframe_api_data);

                })
                .catch(err => {

                    console.log(err);

                })

        })
        .catch(err => {

            console.log(err);

        });

});

module.exports = router;