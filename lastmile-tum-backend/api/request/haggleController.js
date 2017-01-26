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
            res.json(request.haggledPrices);
        });
};

module.exports.declineOffer = function (req, res) {
    if (!req.user) {
        console.log("no user object");
        return res.status(500).send();
    }

    Request.findById(req.params.request_id, function (err, request) {
        if (err) {
            res.status(400).send('Request not found');
            return;
        }

        //remove from haggledPrices array
        var index = request.haggledPrices.indexOf(req.body.haggle);
        request.haggledPrices.splice(index, 1);

        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    })
}

module.exports.acceptOffer = function (req, res) {

    if (!req.user) {
        console.log("no user object");
        return res.status(500).send();
    }

    Request.findById(req.params.request_id, function (err, request) {
        if (err) {
            res.status(400).send('Request not found');
            return;
        }

        if (!request.haggledPrices || request.haggledPrices.length == 0) {
            res.status(400).send('No haggled price yet');
        }

        // if(req.user._id != request.requester){
        //   console.log(req.user._id);
        //   console.log(request.requester);
        //   res.status(401).send('Unauthorized');
        //   return;
        // }

        request.supplier = req.body.haggle.user;
        request.price = req.body.haggle.price;
        request.status = 'Accepted';
        request.haggledPrices = [];

        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    })
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
        /*if (req.body.price < request.price) {
         return res.status(407).send('Invalid offer');
         }*/

        //Initiate array for first offer
        if (!request.haggledPrices) {
            request.haggledPrices = [];
        }
        request.status = "Haggled";
        request.haggledPrices.push({
            user: req.user._id,
            price: req.body.price
        });


        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    });

};