/**
 * Created by DucTien on 20.11.2016.
 */

var mongoose = require('mongoose');

// DB scheme for ratings
var ratingSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  //TODO: check value stars: integer, 1-5
  stars: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
})

var Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
