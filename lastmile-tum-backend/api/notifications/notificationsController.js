/**
 * Created by TimH on 29-Jan-17.
 */

var status = require('http-status');
var Notification = require('./notificationsSchema');
var auth = require('../../authorization/auth');

/*
 * REST API for POST {ROOT}/notification/post
 *
 * */
module.exports.postNotification= function (req, res) {

    var notification= new Notification(req.body.notification);


    notification.save(function (err, noti) {
        if (err) {
            console.log(err);
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }

        res.status(status.CREATED).json(noti);
    });
};


/*
 * REST API for GET {ROOT}/notification/get
 *
 * */
module.exports.getNotifications = function (req, res) {
    Notification
        .find()
        .exec(function (err, notifications) {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR).send(err);
                return;
            }
            res.json(notifications);
        });
};


/*
 * REST API for GET {ROOT}/notification/get/{{request_id}}
 *
 * */
module.exports.getNotification= function (req, res) {
    Notification.findById(req.params.notification_id, function (err, notification) {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }
        res.json(notification);
    });
};


/*
 * REST API for PUT {ROOT}/notification/put/{{notification_id}}

 * */
//TODO: only owner of request can edit it
module.exports.updateNotification= function (req, res) {
    Notification.findByIdAndUpdate(
        req.params.notification_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, notification) {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR).send(err);
                return;
            }
            res.json(notification);
        });
};



module.exports.deleteNotification= function (req, res) {
    Notification.findById(req.params.notification_id, function (err, notification) {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR).send(err);
            return;
        }

        var userId = auth.getUserIdFromRequestToken(req);
        //authorize request.user && req.user.equals(request.user)
        if (userId == notification.user) {
            notification.remove();
            res.status(status.OK).send('notification successfully deleted');
        } else {
            res.status(status.UNAUTHORIZED).send('user is not authorized to delete this notification');
        }
    });
};