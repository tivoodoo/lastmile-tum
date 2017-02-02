angular.module('lastMile')
    .controller('EditProfileCtrl',
        function ($scope, User, userService, Upload, BACKEND_BASE_URL, $uibModal) {

            $scope.pictureUpdated = false;

            var initPicSize = function () {
                $('.pic').height($('.pic').width());
            };
            initPicSize();

            User.get({userID: userService.getUserName()._id}).$promise
                .then(function (myUser) {
                    $scope.user = myUser;

                })
                .catch(function (err) {
                    console.log(err);
                });


            $scope.updateUser = function () {
                var userID = userService.getUserName()._id;
                $scope.pswd1 != null ? $scope.user.password = $scope.pswd1 : "";
                if ($scope.pictureUpdated) {
                    Upload.upload({
                        url: BACKEND_BASE_URL + '/user/' + userID,
                        data: {
                            file: $scope.user.picture,
                            _id: $scope.user._id,
                            email: $scope.user.email,
                            //sex: $scope.user.sex,
                            //birthday: $scope.user.birthday,
                            firstName: $scope.user.firstName,
                            lastName: $scope.user.lastName,
                            street: $scope.user.street,
                            number: $scope.user.number,
                            zipCode: $scope.user.zipCode,
                            town: $scope.user.town,
                            telephone: $scope.user.telephone,
                            trunkSize: $scope.user.trunkSize,
                            password: $scope.user.password,
                            iban: $scope.user.iban,
                            bic: $scope.user.bic
                        }
                        , method: 'PUT'
                    })
                        .then(function (resp) {
                            alert("user successfully updated");
                        }).catch(function (resp) {
                        alert("error while updating user");
                    });
                }
                else {
                    Upload.upload({
                        url: BACKEND_BASE_URL + '/user/' + userID,
                        data: {
                            _id: $scope.user._id,
                            email: $scope.user.email,
                            pictureUpdated: $scope.pictureUpdated,
                            //sex: $scope.user.sex,
                            //birthday: $scope.user.birthday,
                            firstName: $scope.user.firstName,
                            lastName: $scope.user.lastName,
                            street: $scope.user.street,
                            number: $scope.user.number,
                            zipCode: $scope.user.zipCode,
                            town: $scope.user.town,
                            telephone: $scope.user.telephone,
                            trunkSize: $scope.user.trunkSize,
                            password: $scope.user.password,
                            iban: $scope.user.iban,
                            bic: $scope.user.bic
                        }
                        , method: 'PUT'
                    })
                        .then(function (resp) {
                            alert("user successfully updated");
                        }).catch(function (resp) {
                        alert("error while updating user");
                    });
                }
            };

            //Open profile details modal
            $scope.openProfileDetails = function () {
                //var parentElem = parentSelector ?
                //  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    templateUrl: '../../shared/profileDetailsModal/profileDetailsModal.html',
                    controller: 'ProfileDetailsController',
                    size: 'lg',
                    //appendTo: parentElem,
                    resolve: {
                        thisUser: function () {
                            return $scope.user;
                        },
                        pictureUpdated: function () {
                            return $scope.pictureUpdated;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                }, function (err) {

                });
            };


            var initAccordion = function () {
                $(function () {
                    $("#accordion").accordion({
                        collapsible: true,
                        icons: null,
                        heightStyle: "content"
                    });
                });
            };



            initAccordion();


        }
    );