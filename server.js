const express = require('express');
const app = express();

// Routes
const root = require('./routes/root');
const cetus = require('./routes/cetus');

app.use('/', root);
app.use('/cetus', cetus);

// Start Server
const port = 3000;
app.listen(port, () => {

    console.log(`Example app listening on port ${port}`);

});
