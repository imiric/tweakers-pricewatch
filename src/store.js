'use strict';

const Promise = require('bluebird'),
      mongodb = Promise.promisifyAll(require('mongodb')),
      using = Promise.using;


function ProductStore(dbUrl) {
  this.dbUrl = dbUrl;
}


ProductStore.prototype.getConnectionAsync = function() {
  return mongodb.MongoClient.connectAsync(this.dbUrl)
    .disposer(function(connection) {
      connection.close();
    });
};


ProductStore.prototype.saveProductPrice = function(pName, price) {
  return using(
    this.getConnectionAsync(),
    function(connection) {
      return connection.collectionAsync('products')
        .then(function(collection) {
          collection.insertOne({
            productName: pName,
            price: price,
            timestamp: new Date()
          });
        });
    }
  );
};


ProductStore.prototype.getMinPrice = function(pName) {
  return using(
    this.getConnectionAsync(),
    function(connection) {
      return connection.collectionAsync('products')
        .then(function(collection) {
          return collection.findAsync({productName: pName});
        }).then(function(data) {
          return data.sort({price: 1}).limit(1).toArrayAsync();
        });
    }
  ).then(function(results) {
    return results.length ? results[0].price : null;
  });
};


module.exports = exports = ProductStore;
