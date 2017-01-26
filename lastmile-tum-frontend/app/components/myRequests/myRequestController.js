angular.module('lastMile')
  .controller('MyReqCtrl',
    function ($scope, $http, Request, userService,User, Rating, Upload, $filter, $rootScope, $location, BACKEND_BASE_URL) {

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
             User.get({userID:offer.user}).$promise.then(function (user) {
                 offer.userObject = user;
             })
          });
      };

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
            //
          })
          .catch(function (err) {
            alert("error while confirming delivery");
          });
      };

      $scope.deleteRequest = function (req) {
        req.$remove().then(function () {
          alert("request successfully deleted");
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
        $http.post(BACKEND_BASE_URL + '/requests/haggle/accept/' + $scope.actReq._id, {haggle:haggle})
          .then(function successCallBack(response) {
                  $scope.actReq.status = "Accepted";
                  $('#showHaggleOffers').modal('hide');

            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      };

      $scope.declineHaggle = function (haggle) {
          if (haggle.userObject) {
              delete haggle.userObject;
          }
        $http.post(BACKEND_BASE_URL + '/requests/haggle/decline/' + $scope.actReq._id, {haggle:haggle})
          .then(function successCallBack(response) {
                  var index = $scope.actReq.haggledPrices.indexOf(haggle);
                  $scope.actReq.haggledPrices.splice(index, 1);
                if($scope.actReq.haggledPrices.length == 0){
                    $scope.actReq.status = "Open";
                    $('#showHaggleOffers').modal('hide');
                }

              // alert("Declined");
            },
            function errorCallBack(response) {
              alert("Error at backend");
            })
      }


    }
  );