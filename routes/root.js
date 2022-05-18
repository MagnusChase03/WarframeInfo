const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Routes
router.get('/', (req, res) => {

    // Get API Data
    fs.readFile(path.resolve(__dirname, '../database/warframe-api-data.json'), 'utf8', (err, data) => {

        if (err) {

            console.log(err);
            res.send(err);

        } else {

            res.render('root', {warframe_api_data: JSON.parse(data)});

        }

    });

});

module.exports = router;