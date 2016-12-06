/**
 * Created by DucTien on 20.11.2016.
 */

var status = require('http-status');
var Rating = require('./messagesSchema');
var User = require('../user/userSchema');
var auth = require('../../authorization/auth');

/*
 * REST API for POST {ROOT}/message/post
 *
 * */
module.exports.postMessage = function (req, res) {

}

/*
 * REST API for GET {ROOT}/message/threads/request/{request_id}
 *
 * Get all message threads from a request
 * This api will return all user that contacted the requester
 *
 * @params request_id
 *
 * */
module.exports.getThreadsFromRequest = function (req, res) {

}

/*
 * REST API for GET {ROOT}/message/thread/content/
 *
 * Get all messages of a thread.
 * A thread is defined as a combination of request and supplier
 *
 * @params request_id
 * @params supplier_id
 *
 * */
module.exports.getMessagesFromThread = function (req, res) {

}
/*
 * REST API for DELETE {ROOT}/message/thread/
 *
 * Delete all messages of a thread
 *
 * @params request_id
 * @params supplier_id
 *
 * */
module.exports.deleteRequest = function (req, res) {

}
