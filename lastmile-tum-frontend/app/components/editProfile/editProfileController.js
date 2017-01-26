angular.module('lastMile')
    .controller('EditProfileCtrl',
        function ($scope, User, userService, Rating, Upload, BACKEND_BASE_URL) {

            $scope.pictureUpdated = false;
            $scope.rating5 = 0;
            $scope.rating4 = 0;
            $scope.rating3 = 0;
            $scope.rating2 = 0;
            $scope.rating1 = 0;
            $scope.rating0 = 0;
            $scope.ratingCounter = 0;

            User.get({userID: userService.getUserName()._id}).$promise
                .then(function (myUser) {
                    $scope.user = myUser;
                    $scope.totalRating = myUser.ratings.length;
                    angular.forEach(myUser.ratings, function (rating) {
                        $scope.ratingArray = [];
                        Rating.get({ratingID: rating}).$promise.then(function (rat) {
                            if (rat.type === "R") {
                                //rating was given by a requester, therefore the user is the deliverer
                                rat.userType = "deliverer";
                            }
                            else {
                                rat.userType = "requester";
                            }

                            $scope.ratingArray.push(rat);
                            switch (rat.stars) {
                                case 0:
                                    $scope.rating0 += 1;
                                    break;
                                case 1:
                                    $scope.rating1 += 1;
                                    $scope.ratingCounter += 1;
                                    break;
                                case 2:
                                    $scope.rating2 += 1;
                                    $scope.ratingCounter += 2;
                                    break;
                                case 3:
                                    $scope.rating3 += 1;
                                    $scope.ratingCounter += 3;
                                    break;
                                case 4:
                                    $scope.rating4 += 1;
                                    $scope.ratingCounter += 4;
                                    break;
                                case 5:
                                    $scope.rating5 += 1;
                                    $scope.ratingCounter += 5;
                                    break;
                            }
                        }).then(function () {
                            $scope.averageRating = Math.round(($scope.ratingCounter / $scope.totalRating) * 100) / 100;
                            $(function () {
                                $("#rateYoProfile").rateYo({
                                    rating: $scope.averageRating,
                                    readOnly: true
                                });
                            });
                        });
                    })
                })
                .catch(function (err) {
                    console.log(err);
                });


            $scope.updateUser = function () {
                var userID = userService.getUserName()._id;
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
                            iban: $scope.user.password,
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
                            iban: $scope.user.password,
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
            var initPicSize = function () {
                $('.pic').height($('.pic').width());
            };

            var initPicSize2 = function () {
                $('.pic2').height($('.pic2').width());
            };

            var initGraph = function () {
                var dataset = {
                    data: [$scope.rating5, $scope.rating4, $scope.rating3, $scope.rating2, $scope.rating1, $scope.rating0]
                };


                $(function () {
                    (Highcharts.chart({
                        chart: {
                            renderTo: '#starBarchart',
                            type: 'bar',
                            height: 150
                        },
                        title: {
                            text: '',
                            style: {
                                display: 'none'
                            }
                        },
                        subtitle: {
                            text: '',
                            style: {
                                display: 'none'
                            }
                        },
                        xAxis: {
                            categories: ['5', '4', '3', '2', '1', '0'],
                            labels: {enabled: true}
                        },
                        yAxis: {
                            allowDecimals: false,
                            title: {
                                enabled: false
                            },
                            min: 0,
                            max: Math.max($scope.rating5, $scope.rating4, $scope.rating3, $scope.rating2, $scope.rating1, $scope.rating0)
                        },
                        legend: {
                            enabled: false
                        },
                        series: [dataset]
                    }));
                });

            };

            $('#showDetails').on('shown.bs.modal', function () {
                // init upper pic size
                initPicSize2();
                // init graph
                initGraph();
            });

            var initAccordion = function () {
                $(function () {
                    $("#accordion").accordion({
                        collapsible: true,
                        icons: null,
                        heightStyle: "content"
                    });
                });
            };

            initPicSize();

            initAccordion();


        }
    );