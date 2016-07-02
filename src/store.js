'use strict';

const mp = require('mongodb-promise');


function ProductStore(dbUrl) {
  this.dbUrl = dbUrl;
}


/**
 * Save product price information
 * @param {string} pName - The name of the product.
 * @param {Number} price - The price of the product.
 * @returns {Promise} A promise that resolves to the result of the insertion.
 */
ProductStore.prototype.saveProductPrice = function(pName, price) {
  return mp.MongoClient.connect(this.dbUrl)
    .then(function(db) {
      return db.collection('products')
        .then(function(collection) {
          return collection.insert({
            productName: pName,
            price: price,
            timestamp: new Date()
          });
        }).then(function() {
          db.close();
        });
    });
};


/**
 * Get the minimum stored price of the product
 * @param {string} pName - The name of the product.
 * @returns {Promise.<Number>} A promise that resolves to the minimum stored
 *   price of the product or null if not found.
 */
ProductStore.prototype.getMinPrice = function(pName) {
  return mp.MongoClient.connect(this.dbUrl)
    .then(function(db) {
      return db.collection('products')
        .then(function(collection) {
          return collection.find({productName: pName});
        }).then(function(data) {
          return data.sort({price: 1}).limit(1).toArray()
            .then(function(results) {
              db.close();
              return results.length ? results[0].price : null;
            });
        });
    });
};


module.exports = exports = ProductStore;
