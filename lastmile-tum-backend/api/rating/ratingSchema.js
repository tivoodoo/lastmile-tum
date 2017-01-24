/**
 * Created by DucTien on 20.11.2016.
 */

var mongoose = require('mongoose');

// DB scheme for ratings
var ratingSchema = mongoose.Schema({
  // Rating type:
  // R for requester
  // S for supplier
  type: {
    type: String,
    enum: ['R','S'],
    required: true
  },
  //TODO: check value stars: integer, 1-5
  stars: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }
})

var Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
