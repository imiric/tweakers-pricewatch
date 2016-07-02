'use strict';

const mp = require('mongodb-promise');


function ProductStore(dbUrl) {
  this.dbUrl = dbUrl;
}


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
