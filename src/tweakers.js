'use strict';

/**
 * Client library for the tweakers.net API
 */

const rp = require('request-promise'),
      $ = require('cheerio'),
      accounting = require('accounting');

module.exports = exports = {};


/**
 * Retrieve the minimum price of a product
 * @param {string} pName - The name of the product.
 * @returns {Promise.<Number>} A promise that resolves to the minimum price of
 *   the product or null if not found.
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
    let minPrice = null;
    if (typeof res.entities !== 'undefined' && res.entities.length > 0) {
      // Pick the first result
      let product = res.entities.filter(function(ent) {
        return ent.type == 'product';
      }).shift();
      let mp = $(product ? product.minPrice : null);
      if (typeof mp[0] !== 'undefined') {
        minPrice = accounting.unformat(mp[0].children[0].data, ',');
      }
    }
    return minPrice;
  });
};
