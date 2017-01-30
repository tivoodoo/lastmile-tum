/**
 * Created by TimH on 29-Jan-17.
 */

var mongoose = require('mongoose');

// DB scheme for message
var notificationsSchema = mongoose.Schema({
    //enumerate "NewAccept", "NewHaggle", "NewCancel", "NewDelivery", "NewMessage"
    notificationType: {
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
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

var Notification = mongoose.model('Notification', notificationsSchema);

module.exports = Notification;
