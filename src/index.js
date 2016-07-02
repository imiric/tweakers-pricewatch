'use strict';

const tweakers = require('./tweakers.js'),
      ProductStore = require('./store.js'),
      Notifier = require('./notify.js');


module.exports = exports = function(ctx, cb) {
  let store = new ProductStore(ctx.secrets.MONGO_URL),
      apiToken = ctx.secrets.NOTIFY_API_TOKEN,
      notifier = apiToken ? new Notifier(apiToken) : undefined,
      keyword = ctx.params.productName,
      deviceId = ctx.params.notifyDeviceId;

  tweakers.getProductMinPrice(keyword).then(function(product) {
    store.getProductMinPrice(keyword).then(function(storedProduct) {
      if ((storedProduct === null && product.minPrice !== null)
          || (product.minPrice !== null
              && storedProduct.minPrice > product.minPrice)) {
        console.log(product.name + ': found new low price of '
                    + product.minPricePretty);
        store.saveProduct(product).then(function() {
          if (typeof notifier !== 'undefined'
              && typeof deviceId !== 'undefined') {
            notifier.notify(deviceId,
                            'New low price for ' + product.name,
                            product.minPricePretty + '\n' + product.link);
          }
          cb(null, 'Success');
        });
      } else {
        cb(null, 'Success');
      }
    });
  });
};
