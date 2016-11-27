/**
 * Created by DucTien on 20.11.2016.
 */

var mongoose = require('mongoose');

// DB scheme for message
var messagesSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

var Message = mongoose.model('Message', messagesSchema);

module.exports = Message;
