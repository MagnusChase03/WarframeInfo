const express = require('express');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// Routes
const root = require('./routes/root');
const warframe_api_data = require('./routes/warframe-data');

app.use('/', root);
app.use('/warframe-data', warframe_api_data);

// Start Server
const port = 3000;
app.listen(port, () => {

    console.log(`Example app listening on port ${port}`);

});
