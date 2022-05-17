const express = require('express');
const axios = require('axios');
const router = express.Router();

// Routes
router.get('/', (req, res) => {

    res.send("Root");

});

module.exports = router;