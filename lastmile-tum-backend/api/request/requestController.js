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

    if (req.files) {

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