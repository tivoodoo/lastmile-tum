/**
 * Created by DucTien on 08.11.2016.
 * BACKEND schema for delivery request
 */

var mongoose = require('mongoose');
var Float = require('../../mongoose-float.js');

var requestSchema = mongoose.Schema({
  weight: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  depth: {
    type: Number,
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
