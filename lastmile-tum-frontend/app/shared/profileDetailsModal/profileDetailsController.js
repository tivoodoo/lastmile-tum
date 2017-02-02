angular.module('lastMile')
    .controller('ProfileDetailsController',
        function ($scope, $uibModalInstance, thisUser, pictureUpdated, Rating) {
            $scope.pictureUpdated = pictureUpdated ;
            $scope.rating5 = 0;
            $scope.rating4 = 0;
            $scope.rating3 = 0;
            $scope.rating2 = 0;
            $scope.rating1 = 0;
            $scope.rating0 = 0;
            $scope.ratingCounter = 0;
            $(function () {
                $('.pic2').height($('.pic2').width());
            });

            $scope.user = thisUser;
            $scope.totalRating = $scope.user.ratings.length;
            angular.forEach($scope.user.ratings, function (rating) {
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

                    initGraph();

                });
            });




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



            $scope.ok = function () {
                $uibModalInstance.close("ok");
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });