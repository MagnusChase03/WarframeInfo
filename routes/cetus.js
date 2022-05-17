const express = require('express');
const axios = require('axios');
const router = express.Router();

// Routes
router.get('/', (req, res) => {

    // Test API
    axios.get('https://api.warframestat.us/pc/cetusCycle')
        .then(data => {

            res.send(data.data);

        })
        .catch(err => {

            console.log(err);

        });

});

module.exports = router;