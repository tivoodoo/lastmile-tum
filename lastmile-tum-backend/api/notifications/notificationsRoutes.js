/**
 * Created by TimH on 29-Jan-17.
 */


module.exports = notificationsRoutes;

function notificationsRoutes(passport) {
    var notificationsController = require('./notificationsController');

    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    /*
     * REST API
     *
     * */
    router.route('/')
        .post(notificationsController.postNotification)
        .get(notificationsController.getNotifications);

    router.route('/:notification_id')
        .get(notificationsController.getNotification)
        .put(notificationsController.updateNotification)
        .delete(notificationsController.deleteNotification);

    return router;


}
