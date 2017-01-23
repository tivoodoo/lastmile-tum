/**
 * Created by DucTien on 08.11.2016.
 */

var mongoose = require('mongoose');
// working with float currently results in CastError, will work with number until we find a solution for this problem
// var Float = require('mongoose-float').loadType(mongoose);

// DB Schema for request
var requestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    //enumerate S M L XL
    size: {
        type: String,
        required: true
    },
    pickUpLocation: {
        type: String,
        required: true
    },
    deliverToLocation: {
        type: String,
        required: true
    },
    pickUpTime: {
        type: Date,
        required: true
    },
    deliverTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    //enumerate "Open", "Accepted", "Confirmed", "Expired"
    status: {
        type: String,
        required: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    picture: {
        data: String, contentType: String, name: String
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        date: Date
    }],
});

var Request = mongoose.model('Request', requestSchema);

module.exports = Request;
