tweakers-pricewatch
===================

This is a [Tweakers](https://tweakers.net/) product price watch tool that can be
run interactively or executed periodically by [WebTask](https://webtask.io/).

A MongoDB server is required for persisting results, and if you decide to use
[mLab](https://mlab.com/), it can be setup to run completely serverless.

If a new low price for a product is found, a
[Pushbullet](https://www.pushbullet.com/) notification will be sent out to a
configured device.


Setup
-----

```
$ git clone https://github.com/imiric/tweakers-pricewatch
```


Usage
-----

### CLI

1. Export the MongoDB connection string URI and the Pushbullet API token:

    ```
    $ export MONGO_URL='mongodb://[<user>:<pass>@]<host>:<port>/<db>'
    $ export NOTIFY_API_TOKEN='<token>'
    ```

2. Run the tool passing the product name and the Pushbullet device ID (you can
   find this on the Pushbullet website; clicking on the device will show its ID
   in the URL):

   ```
   $ node index.js --product='HTC Vive' --device='<device ID>'
   HTC Vive: found new low price of €999.00
   Sent notification to <device ID>
   ```

   Running the same command again will produce no results if the price hasn't
   decreased.

   You can configure this to run periodically with cron, or use WebTask instead.


### WebTask

1. Install and configure [wt-cli](https://github.com/auth0/wt-cli).

2. To schedule a task to run every hour, run:

   ```
   $ wt cron schedule -s MONGO_URL='mongodb://[<user>:<pass>@]<host>:<port>/<db>' \
   -s NOTIFY_API_TOKEN='<token>' --param productName='HTC Vive' \
   --param notifyDeviceId='<device ID>' --name tweakers-price-vive \
   --bundle --no-merge '0 * * * *' ./index.js
   ```

   Run `wt cron schedule --help` for more information.


License
-------

[MIT](LICENSE)
