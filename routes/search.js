const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();

// Routes
router.post('/', (req, res) => {

    // Get API Data
    fs.readFile(path.resolve(__dirname, '../database/warframe-api-data.json'), 'utf8', (err, data) => {

        if (err) {

            console.log(err);
            res.send(err);

        } else {

            var warframe_api_data = JSON.parse(data);
            var search = req.body.search;
            search = search.toLowerCase();
            var itemURLS = [];

            for (var i = 0; i < warframe_api_data[1]['payload']['items'].length; i++) {

                if (warframe_api_data[1]['payload']['items'][i]['item_name'].toLowerCase().includes(search)) {

                    itemURLS.push(warframe_api_data[1]['payload']['items'][i]['url_name']);

                }

            }

            var searchResults = [];
            var promises = [];
            for (var i = 0; i < itemURLS.length; i++) {

                promises.push(axios.get('https://api.warframe.market/v1/items/' + itemURLS[i] + '/orders?include=item')
                        .then((orders) => {

                            var ordersJSON = orders.data;
                            var itemID = ordersJSON['include']['item']['id'];
                            var item_name = "";
                            for (var j = 0; j < ordersJSON['include']['item']['items_in_set'].length; j++) {

                                if (ordersJSON['include']['item']['items_in_set'][j]['id'] == itemID) {

                                    item_name = ordersJSON['include']['item']['items_in_set'][j]['url_name'];

                                }

                            }

                            ordersJSON['item_name'] = item_name;
                            searchResults.push(ordersJSON);


                        })
                        .catch((err) => {

                            console.log(err);

                        }));

            }

            Promise.all(promises).then(() => {

                //res.send(searchResults);
                res.render('market', { warframe_api_data: warframe_api_data, searchResults: searchResults });

            });

        }

    });

});

module.exports = router;