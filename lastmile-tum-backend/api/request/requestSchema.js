/**
 * Created by DucTien on 08.11.2016.
 */

var mongoose = require('mongoose');
var Float = require('../../mongoose-float.js');

// DB Schema for request
var requestSchema = mongoose.Schema({
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
  willingnessToPay: {
    type: Float,
    required: true
  }
});

var Request = mongoose.model('Request', requestSchema);

module.exports = Request;
