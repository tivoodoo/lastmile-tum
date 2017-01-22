/**
 * Created by DucTien on 20.01.2017.
 */


var Request = require('./requestSchema');

module.exports.getMessages = function (req, res) {
  Request.findById(req.params.request_id)
    .populate('comments.user', 'firstName')
    .exec(function (err, request) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (!request.comments)
        request.comments = [];
      res.json(request.comments);
    });
};

module.exports.putMessage = function (req, res) {

  if (!req.user) {
    console.log("no user object");
    return res.status(500).send();
  }

  Request.findById(req.params.request_id, function (err, request) {
    if (err) {
      res.status(401).send('Not a valid request');
      return;
    }
    if (!request.comments)
      request.comments = [];
    request.comments.push({
      user: req.user._id,
      text: req.body.text,
      date: new Date()
    });
    return request.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({success: true});
    });
  });

};