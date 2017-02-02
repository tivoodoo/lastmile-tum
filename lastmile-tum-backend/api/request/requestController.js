/**
 * Created by DucTien on 08.11.2016.
 */

var status = require('http-status');
var Request = require('./requestSchema');
var auth = require('../../authorization/auth');

/*
 * REST API for POST {ROOT}/request/post
 *
 * */
module.exports.postRequest = function (req, res) {
    var fs = require('fs');
    var request = new Request(req.body.request);

    var userId = auth.getUserIdFromRequestToken(req);

    //do not allow user to fake identity. The user who posted the request must be the same user that is logged in
    if (!(userId == request.requester)) {
        res.status(status.UNAUTHORIZED).send('user for the request does not match the user that is logged in');
        return;
    }

    //img

    if (req.files.file) {

        function base64_encode(file) {
            // read binary data
            var bitmap = fs.readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
        }

        request.picture.data = base64_encode(req.files.file.path);
        request.picture.contentType = req.files.file.type;
        request.picture.name = req.files.file.name;

    }

    request.save(function (err, requ) {
        if (err) {
            console.log(err);
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }

        res.status(status.CREATED).json(requ);
    });
};


/*
 * REST API for GET {ROOT}/request/get
 *
 * */
module.exports.getRequests = function (req, res) {
    Request
        .find()
        //TODO Populate without password
        .populate('user')
        .exec(function (err, requests) {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR).send(err);
                return;
            }
            res.json(requests);
        });
};


/*
 * REST API for GET {ROOT}/request/get/{{request_id}}
 *
 * */
module.exports.getRequest = function (req, res) {
    Request.findById(req.params.request_id, function (err, request) {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(request);
    });
};


/*
 * REST API for PUT {ROOT}/request/put/{{request_id}}
 * request_id is extracted from jwt token and checked if it matches the user request, so only the author of a request can update it
 * */
//TODO: only owner of request can edit it
module.exports.updateRequest = function (req, res) {
    if (req.files && req.files.file) {
        function base64_encode(file) {
            // read binary data
            var bitmap = fs.readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
        }

        var fs = require('fs');
        req.body.picture = {};
        req.body.picture.data = base64_encode(req.files.file.path);
        req.body.picture.contentType = req.files.file.type;
        req.body.picture.name = req.files.file.name;
    }
    Request.findByIdAndUpdate(
        req.params.request_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, request) {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR).send(err);
                return;
            }
            res.json(request);
        });
};


/*
 * REST API for PUT {ROOT}/request/put/{{request_id}}
 * request_id is extracted from jwt token and checked if it matches the user request, so only the author of a request can delete it
 * */
module.exports.deleteRequest = function (req, res) {
    Request.findById(req.params.request_id, function (err, request) {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }

        var userId = auth.getUserIdFromRequestToken(req);
        //authorize request.user && req.user.equals(request.user)
        if (userId == request.requester) {
            request.remove();
            res.status(status.OK).send('request successfully deleted');
        } else {
            res.status(status.UNAUTHORIZED).send('user is not authorized to delete this request');
        }
    });
};

module.exports.postNewAcceptOffer = function (req, res) {

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
        if (!request.acceptOffers) {
            request.acceptOffers = [];
        }
        request.status = "AcceptOffer";
        request.acceptOffers.push({
            user: req.user._id
        });


        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    });

};

module.exports.declineAcceptOffer = function (req, res) {
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
        for (var i = 0; i < request.acceptOffers.length; i++) {
            if (request.acceptOffers[i].user && request.acceptOffers[i].user == req.body.accept.user) {
                request.acceptOffers.splice(i, 1);
                break;
            }
        }

        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    })
};

module.exports.acceptAcceptOffer = function (req, res) {

    if (!req.user) {
        console.log("no user object");
        return res.status(500).send();
    }

    Request.findById(req.params.request_id, function (err, request) {
        if (err) {
            res.status(400).send('Request not found');
            return;
        }

        if (!request.acceptOffers || request.acceptOffers.length == 0) {
            res.status(400).send('No haggled price yet');
        }

        // if(req.user._id != request.requester){
        //   console.log(req.user._id);
        //   console.log(request.requester);
        //   res.status(401).send('Unauthorized');
        //   return;
        // }

        request.supplier = req.body.accept.user;
        request.status = 'Accepted';
        request.haggledPrices = [];
        request.acceptOffers = [];

        return request.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({success: true});
        });
    })
};
