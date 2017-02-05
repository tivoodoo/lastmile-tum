angular.module('lastMile')
  .service("notificationService", ['ws', function (ws) {

    // Attributes
    this.observers = [];
    this.notifyObservers = notifyObservers;

    // Implementation
    var self = this;

    function notifyObservers(msg) {

      // external observers
      ws.send(msg);
    }

    function notifyLocalObservers(msg) {
      _.forEach(self.observers, function (obs) {
        if (obs.notify) {
          obs.notify(msg);
        }
      });
    }

    ws.on('message', function (event) {
      // console.log("LOCAL BROADCAST: " + event.data);
      notifyLocalObservers(event.data);
    });

  }]);