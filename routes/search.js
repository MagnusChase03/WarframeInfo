const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();

// Return the list of items matching search
function get_items(search, warframe_api_data) {

    var item_urls = [];

    for (var i = 0; i < warframe_api_data[1]['payload']['items'].length; i++) {

        if (warframe_api_data[1]['payload']['items'][i]['item_name'].toLowerCase().includes(search)) {

            item_urls.push(warframe_api_data[1]['payload']['items'][i]['url_name']);

        }

    }

    return item_urls;

}

// Gets top 3 orders per item
function get_best_orders(search_results, market_type) {

    var best_orders = [];

    for (var i = 0; i < search_results.length; i++) {

        for (var j = 0; j < 3; j++) {

            if (search_results[i] && search_results[i].length > 0) {

                var best = search_results[i][0]['platinum'];
                var best_index = 0;
                for (var k = 0; k < search_results[i].length; k++) {

                    if (market_type == "sell" && search_results[i][k]['platinum'] < best) {

                        best = search_results[i][k]['platinum'];
                        bestIndex = k;

                    } else if (market_type == "buy" && search_results[i][k]['platinum'] > best) {

                        best = search_results[i][k]['platinum'];
                        bestIndex = k;

                    }

                }

                best_orders.push(search_results[i][bestIndex]);
                search_results[i].pop(best_index);

            }

        }

    }

    return best_orders;

}

// Gets all orders matching search params
function get_orders(item_urls, market_type, res) {

    var search_results = [];
    var promises = [];
    for (var i = 0; i < item_urls.length; i++) {

        promises.push(axios.get('https://api.warframe.market/v1/items/' + item_urls[i] + '/orders?include=item')
            .then((orders) => {

                var matching_orders = [];

                var orders_json = orders.data;

                // Get Item Name
                var itemID = orders_json['include']['item']['id'];
                var item_name = "";
                for (var j = 0; j < orders_json['include']['item']['items_in_set'].length; j++) {

                    if (orders_json['include']['item']['items_in_set'][j]['id'] == itemID) {

                        item_name = orders_json['include']['item']['items_in_set'][j]['url_name'];

                    }

                }

                // Get orders sell/buy
                for (var j = 0; j < orders_json['payload']['orders'].length; j++) {

                    if (orders_json['payload']['orders'][j]['order_type'] == market_type && orders_json['payload']['orders'][j]['user']['status'] == "ingame") {

                        orders_json['payload']['orders'][j]['item_name'] = item_name;
                        matching_orders.push(orders_json['payload']['orders'][j]);

                    }

                }

                search_results.push(matching_orders);


            })
            .catch((err) => {

                console.log(err);

            }));

    }

    Promise.all(promises).then(() => {

        var best_orders = get_best_orders(search_results, market_type);
        res.render('market', { search_results: best_orders });

    });

}

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

            item_urls = get_items(search, warframe_api_data);
            get_orders(item_urls, req.body.market_type, res);

        }

    });

});

module.exports = router;