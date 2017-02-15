angular.module('lastMile')
  .controller('MyReqCtrl',
    function ($scope, $http, Request, userService, User, Rating, Upload, $filter, $rootScope, $location, BACKEND_BASE_URL, notificationService, Notification, $uibModal) {

      getRequests();

      notificationService.observers.push($scope);
      $scope.notify = notify;
      $scope.getRequests = getRequests;

      function notify(msg) {
        if (msg == 'newNotification') {
          getRequests();
        }
      }

      function getRequests(){
        Request.query()
          .$promise.then(function (data) {
          var filteredRequests = $filter('filter')(data, {requester: userService.getUserName()._id});
          if (filteredRequests.length == 0) {
            $scope.createReqText = "Unfortunately, you do not have any requests yet. To create one, click the 'Create request' button in the top toolbar!";
          }
          else {
            $scope.hasRequests = true;
          }
          $scope.requests = filteredRequests;
        });
      }


      //show request details modal
      $scope.openRequestDetails = function (request) {

          $rootScope.selectedRequestId = $scope.selectedRequest._id;
        //var parentElem = parentSelector ?
        //  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          templateUrl: '../../shared/requestDetailsModal/requestDetailsModal.html',
          controller: 'RequestDetailsController',
          size: 'lg',
          //appendTo: parentElem,
          resolve: {
            thisRequest: function () {
              return request;
            }
          }
        });


        modalInstance.result.then(function (result) {
          if (result == "Accept" || result == "Haggle") {
            $location.path("/myDel");
          }
          else {
            console.log("error while closing request detail modal");
          }
        }, function (err) {

        });
      };


      //Open profile details modal
      $scope.openProfileDetails = function (supplier) {
        //var parentElem = parentSelector ?
        //  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          templateUrl: '../../shared/profileDetailsModal/profileDetailsModal.html',
          controller: 'ProfileDetailsController',
          size: 'lg',
          //appendTo: parentElem,
          resolve: {
            thisUserID: function () {
              return supplier;
            },
            pictureUpdated: function () {
              return false;
            },
            updatedUserPicture: function () {
              return null;
            }
          }
        });


        modalInstance.result.then(function (result) {

        }, function (err) {

        });
      };


      $scope.selectUser = function (usr) {
        console.log(usr);
        $scope.user = usr;
      };


      //jquery for rating
      $(function () {
        $("#rateYoReq").rateYo({
          starWidth: "40px",
          rating: 3,
          fullStar: true
        });


        $("#rateYoReq").rateYo()
          .on("rateyo.set", function (e, data) {
            $scope.rating.stars = data.rating;
          });
      });


      $scope.actReq = new Request();
      $scope.setActReq = function (req) {
        $scope.actReq = req;
      };


      $scope.rating = new Rating();
      $scope.rating.comment = '';
      $scope.rate = function () {
        $scope.rating.type = 'R';
        $scope.rating.request = $scope.actReq._id;
        $scope.rating.ratedUser = $scope.actReq.supplier;

        $scope.rating.$save()
          .then(function () {
            $scope.actReq.ratedByRequester = true;
            $('#showRating').modal('hide');
          })
          .catch(function () {
            alert("An error occured while rating the deliverer");
          });
      };


      $scope.getUsers = function (req) {
        angular.forEach(req.haggledPrices, function (offer) {
            User.get({userID: offer.user}).$promise.then(function (user) {
              offer.userObject = user;

              if (user.ratings && (!user.ratings.length == 0)) {
                var ratingCounter = 0;
                angular.forEach(user.ratings, function (rating) {
                  Rating.get({ratingID: rating}).$promise.then(function (rat) {
                      switch (rat.stars) {
                        case 0:
                          break;
                        case 1:
                          ratingCounter += 1;
                          break;
                        case 2:
                          ratingCounter += 2;
                          break;
                        case 3:
                          ratingCounter += 3;
                          break;
                        case 4:
                          ratingCounter += 4;
                          break;
                        case 5:
                          ratingCounter += 5;
                          break;
                      }
                    }
                  ).then(function () {
                    offer.userObject.avgRating = Math.round((ratingCounter / user.ratings.length) * 100) / 100;
                  })
                });


              }
              else {
                offer.userObject.avgRating = "No ratings yet";
              }
            })
          }
        );

        // get user + ratings for acceptoffers

        angular.forEach(req.acceptOffers, function (offer) {
            User.get({userID: offer.user}).$promise.then(function (user) {
              offer.userObject = user;

              if (user.ratings && (!user.ratings.length == 0)) {
                var ratingCounter = 0;
                angular.forEach(user.ratings, function (rating) {
                  Rating.get({ratingID: rating}).$promise.then(function (rat) {
                      switch (rat.stars) {
                        case 0:
                          break;
                        case 1:
                          ratingCounter += 1;
                          break;
                        case 2:
                          ratingCounter += 2;
                          break;
                        case 3:
                          ratingCounter += 3;
                          break;
                        case 4:
                          ratingCounter += 4;
                          break;
                        case 5:
                          ratingCounter += 5;
                          break;
                      }
                    }
                  ).then(function () {
                    offer.userObject.avgRating = Math.round((ratingCounter / user.ratings.length) * 100) / 100;
                  })
                });


              }
              else {
                offer.userObject.avgRating = "No ratings yet";
              }
            })
          }
        );
      };


      $scope.editRequest = function (req) {
        $rootScope.requestToEdit = req
        $location.path("/editReq");
      };


      $scope.confirmDelivery = function (req) {
        req.status = "Delivered";
        if (req.picture) {
          delete req.picture;
        }
        req.$update({requestID: req._id})
          .then(function (res) {
            var notification = new Notification();
            notification.notificationType = "NewDelivery";
            notification.request = req._id;
            notification.recipient = req.requester;
            notification.sender = userService.getUserName()._id;

            notification.$save(function (res) {
            }, function (err) {
              console.log(err);
            });
            //
          })
          .catch(function (err) {
            alert("error while confirming delivery");
          });
      };


      $scope.deleteRequest = function (req) {
        req.$remove().then(function () {
          var index = $scope.requests.indexOf(req);
          $scope.requests.splice(index, 1);
        })
          .catch(function (err) {
            alert("could not delete request");
          })

      };


      $scope.acceptHaggle = function (haggle) {
        if (haggle.userObject) {
          delete haggle.userObject;
        }
        $http.post(BACKEND_BASE_URL + '/requests/haggle/accept/' + $scope.actReq._id, {haggle: haggle})
          .then(function successCallBack(response) {
              var notification = new Notification();
              notification.notificationType = "NewAccept";
              notification.request = $scope.actReq._id;
              notification.recipient = haggle.user;
              notification.sender = userService.getUserName()._id;

              notification.$save(function (res) {
                  notificationService.notifyObservers('newNotification');
              }, function (err) {
                console.log(err);
              });
              $scope.actReq.price = haggle.price;
              $scope.actReq.status = "Accepted";
              $scope.actReq.supplier = haggle.user;
              $('#showOffers').modal('hide');

            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      };


      $scope.declineHaggle = function (haggle) {
        if (haggle.userObject) {
          delete haggle.userObject;
        }
        console.log(haggle);
        $http.post(BACKEND_BASE_URL + '/requests/haggle/decline/' + $scope.actReq._id, {haggle: haggle})
          .then(function successCallBack(response) {
              var notification = new Notification();
              notification.notificationType = "NewDecline";
              notification.request = $scope.actReq._id;
              notification.recipient = haggle.user;
              notification.sender = userService.getUserName()._id;

              notification.$save(function (res) {
                  notificationService.notifyObservers('newNotification');
              }, function (err) {
                console.log(err);
              });
              var index = $scope.actReq.haggledPrices.indexOf(haggle);
              $scope.actReq.haggledPrices.splice(index, 1);
              if ($scope.actReq.haggledPrices.length == 0 && $scope.actReq.acceptOffers.length == 0) {
                $scope.actReq.status = "Open";
                $('#showOffers').modal('hide');
              }

              // alert("Declined");
            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      };


      $scope.acceptAccept = function (accept) {
        if (accept.userObject) {
          delete accept.userObject;
        }
        $http.post(BACKEND_BASE_URL + '/requests/acceptOffer/accept/' + $scope.actReq._id, {accept: accept})
          .then(function successCallBack(response) {
              var notification = new Notification();
              notification.notificationType = "NewAccept";
              notification.request = $scope.actReq._id;
              notification.recipient = accept.user;
              notification.sender = userService.getUserName()._id;

              notification.$save(function (res) {
                  notificationService.notifyObservers('newNotification');
              }, function (err) {
                console.log(err);
              });
              $scope.actReq.status = "Accepted";
              $scope.actReq.supplier = accept.user;
              $('#showOffers').modal('hide');

            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      };


      $scope.declineAccept = function (accept) {
        if (accept.userObject) {
          delete accept.userObject;
        }
        $http.post(BACKEND_BASE_URL + '/requests/acceptOffer/decline/' + $scope.actReq._id, {accept: accept})
          .then(function successCallBack(response) {
              var notification = new Notification();
              notification.notificationType = "NewDecline";
              notification.request = $scope.actReq._id;
              notification.recipient = accept.user;
              notification.sender = userService.getUserName()._id;

              notification.$save(function (res) {
                  notificationService.notifyObservers('newNotification');
              }, function (err) {
                console.log(err);
              });
              var index = $scope.actReq.acceptOffers.indexOf(accept);
              $scope.actReq.acceptOffers.splice(index, 1);
              if ($scope.actReq.haggledPrices.length == 0 && $scope.actReq.acceptOffers.length == 0) {
                $scope.actReq.status = "Open";
                $('#showOffers').modal('hide');
              }

              // alert("Declined");
            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      };


    }
  )
;