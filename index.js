'use strict';

module.exports = exports = require('./src');


if (require.main === module) {
  const argv = require('yargs').argv;
  let ctx = {
    secrets: {
      MONGO_URL: process.env.MONGO_URL,
      NOTIFY_API_TOKEN: process.env.NOTIFY_API_TOKEN
    },
    params: {
      productName: argv.product,
      notifyDeviceId: argv.device
    }
  };
  exports(ctx, function(err, res) {});
}
