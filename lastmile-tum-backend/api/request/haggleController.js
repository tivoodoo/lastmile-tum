/**
 * Created by DucTien on 23.01.2017.
 */


var Request = require('./requestSchema');

/**
 *
 * @param req
 * @param res
 */
module.exports.getNewOffer = function (req, res) {
  Request.findById(req.params.request_id)
    .exec(function (err, request) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (!request.haggledPrices || request.haggledPrices.length == 0) {
        res.status(401).send("No haggle offer yet");
      }
      res.json(request.haggledPrices[0]);
    });
};

module.exports.declineOffer = function (req, res) {
  console.log("Test");
}
/**
 *
 * @param req
 * @param res
 * @returns {*}
 */
module.exports.postNewOffer = function (req, res) {

  if (!req.user) {
    console.log("no user object");
    return res.status(500).send();
  }

  Request.findById(req.params.request_id, function (err, request) {
    if (err) {
      res.status(401).send('Not a valid request');
      return;
    }

    //Request even cheaper price than given price of requester -> decline
    if (req.body.price < request.price) {
      return res.status(406).send('Invalid offer');
    }

    //Initiate array for first offer
    if (!request.haggledPrices) {
      request.haggledPrices = [];
    }

    //In case of first offer or offer declined
    if (request.haggledPrices.length == 0) {
      request.haggledPrices.push({
        user: req.user._id,
        price: req.body.price
      })
    }
    //Only accept cheaper offer
    else if (req.body.price < request.haggledPrices[0].price) {
      //Delete old offer
      request.haggledPrices = [];
      //Push new offer into array
      request.haggledPrices.push({
        user: req.user._id,
        price: req.body.price
      })
    }
    else{
      return res.status(406).send('Invalid offer');
    }

    return request.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({success: true});
    });
  });

};