/**
 * Created by DucTien on 08.11.2016.
 */


module.exports = requestRoutes;

function requestRoutes(passport) {
    var requestController = require('./requestController');

    var router =  require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    /*
     * REST API for POST {ROOT}/request/post
     *
     * */
    router.post('/post', requestController.postRequest);

    /*
     * REST API for GET {ROOT}/request/get
     *
     * */
    router.get('/get', requestController.getRequests);

    /*
     * REST API for GET {ROOT}/request/get/{{request_id}}
     *
     * */
    router.get('/get/:request_id', requestController.getRequest);

    /*
     * REST API for PUT {ROOT}/request/put/{{request_id}}
     * request_id is extracted from jwt token and checked if it matches the user request, so only the author of a request can update it
     * */
    router.put('/put/:request_id', requestController.updateRequest);

    /*
     * REST API for PUT {ROOT}/request/put/{{request_id}}
     * request_id is extracted from jwt token and checked if it matches the user request, so only the author of a request can delete it
     * */
    router.delete('/delete/:request_id', requestController.deleteRequest);

    return router;


}
