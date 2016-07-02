'use strict';

const mp = require('mongodb-promise');


function ProductStore(dbUrl) {
  this.dbUrl = dbUrl;
}


/**
 * Save a product to the DB
 * @param {Object} product - The product object.
 * @returns {Promise} A promise that resolves to the result of the insertion.
 */
ProductStore.prototype.saveProduct = function(product) {
  return mp.MongoClient.connect(this.dbUrl)
    .then(function(db) {
      return db.collection('products')
        .then(function(collection) {
          product.timestamp = new Date();
          return collection.insert(product);
        }).then(function() {
          db.close();
        });
    });
};


/**
 * Get the minimum stored price of the product
 * @param {string} keyword - The product lookup keyword.
 * @returns {Promise.<Object>} A promise that resolves to the product object
 *   with the minimum price.
 */
ProductStore.prototype.getProductMinPrice = function(keyword) {
  return mp.MongoClient.connect(this.dbUrl)
    .then(function(db) {
      return db.collection('products')
        .then(function(collection) {
          return collection.find({keyword: keyword});
        }).then(function(data) {
          return data.sort({minPrice: 1}).limit(1).toArray()
            .then(function(results) {
              db.close();
              return results.length ? results[0] : null;
            });
        });
    });
};


module.exports = exports = ProductStore;
