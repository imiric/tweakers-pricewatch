'use strict';

/**
 * Client library for the tweakers.net API
 */

const rp = require('request-promise'),
      $ = require('cheerio'),
      accounting = require('accounting'),
      pick = require('lodash.pick'),
      merge = require('lodash.merge');

module.exports = exports = {};


/**
 * Retrieve the product with the minimum price
 * @param {string} pName - The name of the product.
 * @returns {Promise.<Object>} A promise that resolves to a a product object
 *   with the minimum price.
 */
exports.getProductMinPrice = function(pName) {
  const reqOptions = {
    uri: 'https://tweakers.net/xmlhttp/xmlHttp.php',
    qs: {
      application: 'sitewidesearch',
      type: 'search',
      action: 'pricewatch',
      keyword: pName,
      output: 'json'
    },
    json: true
  };

  return rp(reqOptions).then(function(res) {
    let prod = {keyword: pName, minPrice: null};
    if (typeof res.entities !== 'undefined' && res.entities.length > 0) {
      // Pick the first result
      let product = res.entities.filter(function(ent) {
        return ent.type == 'product';
      }).shift(),
          mp = [];

      if (product) {
        prod = merge(prod, pick(product, ['name', 'link']));
        mp = $(product.minPrice);
      }
      if (mp.length) {
        prod.minPrice = accounting.unformat(mp[0].children[0].data, ',');
        prod.minPricePretty = accounting.formatMoney(prod.minPrice, '€', 2);
      }
    }
    return prod;
  });
};
