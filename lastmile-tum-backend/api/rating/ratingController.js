/**
 * Created by DucTien on 20.11.2016.
 */

var status = require('http-status');
var Rating = require('./ratingSchema');


/*
 * REST API for POST {ROOT}/rating/post
 *
 * */
module.exports.postRating = function(req,res){

}

/*
 * REST API for GET {ROOT}/rating/{{rating_id}}
 *
 * */
module.exports.getRating = function(req,res){

}

/*
 * REST API for GET {ROOT}/rating/request/{{request_id}}
 * Return all rating from a request
 *
 * */

module.exports.getRatingFromRequest = function(req,res){

}

/*
 * REST API for PUT {ROOT}/rating/{{request_id}}
 * */
module.exports.updateRating = function(req,res){

}

/*
 * REST API for DELETE {ROOT}/rating/{{rating_id}}
 * */
module.exports.deleteRating = function(req,res){

}
