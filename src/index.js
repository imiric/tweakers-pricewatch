'use strict';

const tweakers = require('./tweakers.js'),
      ProductStore = require('./store.js'),
      Notifier = require('./notify.js'),
      accounting = require('accounting');


module.exports = exports = function(ctx, cb) {
  let store = new ProductStore(ctx.secrets.MONGO_URL),
      apiToken = ctx.secrets.NOTIFY_API_TOKEN,
      notifier = apiToken ? new Notifier(apiToken) : undefined,
      pName = ctx.params.productName,
      deviceId = ctx.params.notifyDeviceId;

  tweakers.getProductMinPrice(pName).then(function(price) {
    store.getMinPrice(pName).then(function(storedMinPrice) {
      if ((storedMinPrice === null && price !== null)
          || (price !== null && storedMinPrice > price)) {
        let prettyPrice = accounting.formatMoney(price, '€', 2);
        console.log(pName + ': found new low price of ' + prettyPrice);
        store.saveProductPrice(pName, price).then(function() {
          if (typeof notifier !== 'undefined'
              && typeof deviceId !== 'undefined') {
            notifier.notify(deviceId,
                            'New low price for ' + pName, prettyPrice);
          }
          cb(null, 'Success');
        });
      } else {
        cb(null, 'Success');
      }
    });
  });
};
