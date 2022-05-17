const express = require('express');
const axios = require('axios');
const router = express.Router();

// Routes
router.get('/', (req, res) => {

    // Get API Data
    axios.get('http://0.0.0.0:3000/warframe-data')
        .then(warframe_api_data => {

            res.render('root.ejs', {warframe_api_data: warframe_api_data.data});

        })
        .catch(err => {

            console.log(err);

        });

});

module.exports = router;